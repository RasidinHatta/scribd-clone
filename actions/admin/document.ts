"use server" // Marks all exports as server actions

import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import cloudinary from 'cloudinary'
import { startOfMonth, subMonths } from "date-fns"

// Cloudinary configuration
const cloudinaryAppName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/**
 * Fetches a document by ID with associated user data
 * @param {string} id - Document ID to fetch
 * @returns {Promise<{success: boolean, data?: Document, error?: string}>} 
 * Returns document with ISO date strings or error
 */
export const getDocumentById = async (id: string) => {
    try {
        const doc = await db.document.findUnique({
            where: { id },
            include: { user: true } // Include author details
        })

        if (!doc) {
            return { success: false, error: "Document not found" }
        }

        // Convert dates to ISO strings for client-side serialization
        return {
            success: true,
            data: {
                ...doc,
                createdAt: doc.createdAt.toISOString(),
                updatedAt: doc.updatedAt.toISOString()
            }
        }
    } catch (error) {
        console.error("Failed to fetch document:", error)
        return { success: false, error: "Failed to fetch document's details" }
    }
}

/**
 * Fetches all comments for a specific document
 * @param {string} id - Document ID
 * @returns {Promise<{success: boolean, data?: Comment[], error?: string}>} 
 * Returns comments with user data or error
 */
export const getDocumentComments = async (id: string) => {
    try {
        const comments = await db.comment.findMany({
            where: { documentId: id },
            include: { user: true } // Include comment author details
        });

        if (!comments) {
            return { success: false, error: "No comments found" }
        }

        return {
            success: true,
            data: comments
        }
    } catch (error) {
        console.error("Failed to fetch comments:", error)
        return { success: false, error: "Failed to fetch comments" }
    }
}

/**
 * Updates a document's title and/or description
 * @param {string} documentId - ID of document to update
 * @param {Object} data - Update fields (title and/or description)
 * @returns success: boolean, error?: string
 * Returns success status or validation/update error
 */
export const editDocumentById = async (
    documentId: string,
    data: {
        title?: string
        description?: string | null
    }
) => {
    try {
        // Input validation
        if (data.title && data.title.trim().length < 2) {
            return { success: false, error: "Title must be at least 2 characters" }
        }

        if (data.title && data.title.length > 100) {
            return { success: false, error: "Title cannot exceed 100 characters" }
        }

        if (data.description && data.description.length > 500) {
            return { success: false, error: "Description cannot exceed 500 characters" }
        }

        // Prepare update data with automatic updatedAt timestamp
        const updateData: {
            title?: string
            description?: string | null
            updatedAt: Date
        } = {
            updatedAt: new Date(), // Always update the timestamp
        }

        // Only include changed fields
        if (data.title) {
            updateData.title = data.title
        }

        // Handle empty string as null (description removal)
        if (data.description !== undefined) {
            updateData.description = data.description || null
        }

        // Perform the update
        await db.document.update({
            where: { id: documentId },
            data: updateData,
        })

        // Revalidate the documents page to show fresh data
        revalidatePath("/admin/documents")

        return {
            success: true,
        }
    } catch (error) {
        console.error("Document update failed:", error)

        // Type-safe error handling
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message || "Failed to update document"
            }
        }

        return {
            success: false,
            error: "An unknown error occurred"
        }
    }
}

/**
 * Deletes a document from database and Cloudinary
 * @param {string} id - Document ID to delete
 * @returns success: boolean, error?: string
 * Returns success status or deletion error
 */
export const deleteDocumentById = async (id: string) => {
  try {
    // First get the document to obtain the Cloudinary publicId
    const document = await db.document.findUnique({
      where: { id },
      select: { publicId: true } // Only fetch what we need
    });

    if (!document) {
      return { success: false, error: "Document not found" };
    }

    // Delete from database first (more critical operation)
    await db.document.delete({
      where: { id }
    });

    // If document has a Cloudinary ID, attempt to delete from storage
    if (document.publicId) {
      try {
        await deleteDocumentFromCloudinary(document.publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion failed:", cloudinaryError);
        // Continue despite Cloudinary failure - the database record is already gone
      }
    }

    // Revalidate the documents page
    revalidatePath("/admin/documents");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete document" 
    };
  }
}

/**
 * Helper function to delete a document from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns Cloudinary deletion result
 * @throws {Error} If deletion fails
 */
export const deleteDocumentFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Failed to delete Document from Cloudinary:", error);
    throw new Error("Cloudinary document deletion failed.");
  }
}

/**
 * Fetches document statistics (month vs all-time).
 * @param mode "month" | "all"
 */
export const fetchDocumentStats = async (mode: "month" | "all") => {
  const now = new Date()
  const startThisMonth = startOfMonth(now)
  const startLastMonth = startOfMonth(subMonths(now, 1))

  if (mode === "month") {
    // Docs created this month
    const thisMonthDocuments = await db.document.count({
      where: { createdAt: { gte: startThisMonth } },
    })

    // Docs created last month
    const lastMonthDocuments = await db.document.count({
      where: { createdAt: { gte: startLastMonth, lt: startThisMonth } },
    })

    const percentageChange =
      lastMonthDocuments === 0
        ? thisMonthDocuments > 0
          ? 100
          : 0
        : ((thisMonthDocuments - lastMonthDocuments) / lastMonthDocuments) * 100

    return {
      totalDocuments: thisMonthDocuments,
      lastMonthDocuments,
      percentageChange: Math.round(percentageChange),
    }
  }

  // All time stats
  const totalDocuments = await db.document.count()
  return {
    totalDocuments,
    percentageChange: 0, // all-time doesn't compare
  }
}


export async function fetchMostCommentedDocument() {
  const mostCommented = await db.document.findFirst({
    orderBy: {
      Comment: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: { Comment: true },
      },
    },
  })

  if (!mostCommented) {
    return { title: "No documents yet", commentCount: 0 }
  }

  return {
    title: mostCommented.title,
    commentCount: mostCommented._count.Comment,
  }
}