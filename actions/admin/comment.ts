"use server" // Marks all exports as server actions

import { auth } from "@/auth"
import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import { startOfMonth, subMonths } from "date-fns"

/**
 * Fetches a comment by ID with associated user and document info
 * @param {string} commentId - The ID of the comment to fetch
 * @returns success: boolean, data?: CommentWithRelations, error?: string
 */
export const getCommentById = async (commentId: string) => {
    try {
        const comment = await db.comment.findUnique({
            where: {
                id: commentId,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                parentId: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    },
                },
                document: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        })

        if (!comment) {
            return { success: false, error: "Comment not found" }
        }

        return {
            success: true,
            data: {
                ...comment,
                isReply: !!comment.parentId, // Flag indicating if this is a reply
            },
        }
    } catch (error) {
        console.error("Error fetching comment:", error)
        return { success: false, error: "Failed to fetch comment" }
    }
}

/**
 * Fetches basic user information by ID
 * @param {string} userId - The ID of the user to fetch
 * @returns success: boolean, data?: UserBasicInfo, error?: string
 */
export const getUserById = async (userId: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
                email: true,
            },
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        return { success: true, data: user }
    } catch (error) {
        console.error("Error fetching user:", error)
        return { success: false, error: "Failed to fetch user" }
    }
}

/**
 * Fetches document information associated with a comment
 * @param {string} commentId - The ID of the comment
 * @returns success: boolean, data?: DocumentInfo, error?: string
 */
export const getDocumentByCommentId = async (commentId: string) => {
    try {
        const result = await db.comment.findUnique({
            where: {
                id: commentId,
            },
            select: {
                document: {
                    select: {
                        title: true,
                        publicId: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        })

        if (!result?.document) {
            return { success: false, error: "Comment or document not found" }
        }

        return {
            success: true,
            data: {
                title: result.document.title,
                publicId: result.document.publicId,
                userName: result.document.user.name,
                userEmail: result.document.user.email
            }
        }
    } catch (error) {
        console.error("Error fetching document by comment ID:", error)
        return { success: false, error: "Failed to fetch document" }
    }
}

/**
 * Fetches all replies to a specific comment
 * @param {string} commentId - The ID of the parent comment
 * @returns success: boolean, data?: Reply[], error?: string
 */
export const getRepliesByCommentId = async (commentId: string) => {
    try {
        const replies = await db.comment.findMany({
            where: {
                parentId: commentId, // Find all child comments
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc', // Oldest replies first
            },
        })

        return {
            success: true,
            data: replies.map(reply => ({
                ...reply,
                // Handle case where user might be deleted
                user: reply.user || { id: 'deleted-user', name: 'Deleted User', email: '' }
            })),
        }
    } catch (error) {
        console.error("Error fetching replies:", error)
        return { success: false, error: "Failed to fetch replies" }
    }
}

/**
 * Deletes a comment by ID (admin only)
 * @param {string} id - The ID of the comment to delete
 * @returns success: boolean, error?: string
 */
export const deleteCommentById = async (id: string) => {
  try {
    // Verify admin authentication
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify comment exists
    const comment = await db.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      return { success: false, error: "Comment not found" }
    }

    // Perform deletion
    await db.comment.delete({
      where: { id },
    })

    // Refresh the comments page
    revalidatePath("/admin/comments")

    return { success: true }
  } catch (error) {
    console.error("Delete failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete comment",
    }
  }
}

/**
 * Updates a comment's content (admin only)
 * @param {string} commentId - The ID of the comment to update
 * @param {Object} data - Update data (currently just content)
 * @returns success: boolean, error?: string
 */
export const editCommentById = async (
  commentId: string,
  data: {
    content?: string
  }
) => {
  try {
    // Verify admin authentication
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Perform update with automatic timestamp
    await db.comment.update({
      where: { id: commentId },
      data: {
        ...data,
        updatedAt: new Date(), // Always update the timestamp
      },
    })

    // Refresh the comments page
    revalidatePath("/admin/comments")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Comment update failed:", error)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update comment",
    }
  }
}

/**
 * Fetches comment statistics (month vs all-time).
 * @param mode "month" | "all"
 */
export const fetchCommentStats = async (mode: "month" | "all") => {
  const now = new Date()
  const startThisMonth = startOfMonth(now)
  const startLastMonth = startOfMonth(subMonths(now, 1))

  if (mode === "month") {
    // Comments this month
    const thisMonthComments = await db.comment.count({
      where: { createdAt: { gte: startThisMonth } },
    })

    // Comments last month
    const lastMonthComments = await db.comment.count({
      where: { createdAt: { gte: startLastMonth, lt: startThisMonth } },
    })

    const percentageChange =
      lastMonthComments === 0
        ? thisMonthComments > 0
          ? 100
          : 0
        : ((thisMonthComments - lastMonthComments) / lastMonthComments) * 100

    return {
      totalComments: thisMonthComments,
      lastMonthComments,
      percentageChange: Math.round(percentageChange),
    }
  }

  // All time stats
  const totalComments = await db.comment.count()
  return {
    totalComments,
    percentageChange: 0,
  }
}