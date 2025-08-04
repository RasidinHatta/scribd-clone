"use server"

// This file contains server-side actions for managing roles in the application.
// It provides a function to edit a role by its ID using Prisma ORM.

import { Role } from "@/lib/generated/prisma/client";
import db from "@/prisma/prisma";

/**
 * Updates a role in the database by its ID.
 * @param roleId - The unique identifier of the role to update.
 * @param data - Partial role data to update.
 * @returns An object indicating success or failure, and the updated role or error message.
 */
export async function editRoleById(
  roleId: string,
  data: Partial<Role>
): Promise<{ success: boolean; data?: Role; error?: string }> {
  try {
    // Attempt to update the role with the provided data
    const updatedRole = await db.role.update({
      where: { id: roleId },
      data: {
        name: data.name,
        description: data.description,
        createDocument: data.createDocument,
        readDocument: data.readDocument,
        updateDocument: data.updateDocument,
        deleteDocument: data.deleteDocument,
        createComment: data.createComment,
        readComment: data.readComment,
        updateComment: data.updateComment,
        deleteComment: data.deleteComment,
      },
    })
    return { success: true, data: updatedRole }
  } catch (error) {
    // Log and return error if update fails
    console.error("Failed to update role:", error)
    return { success: false, error: "Failed to update role" }
  }
}