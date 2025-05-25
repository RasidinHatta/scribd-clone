"use server"


import { Role } from "@/lib/generated/prisma/client";
import db from "@/prisma/prisma";

export async function editRoleById(
  roleId: string,
  data: Partial<Role>
): Promise<{ success: boolean; data?: Role; error?: string }> {
  try {
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
    console.error("Failed to update role:", error)
    return { success: false, error: "Failed to update role" }
  }
}