"use server"

import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"

export const deleteUserById = async (userId: string) => {
 try {
    await db.user.delete({
      where: { id: userId }
    })
    // Revalidate the path if needed
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Delete failed:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

// app/actions/admin/user.ts
export const getUserById = async (userId: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return { 
      success: true, 
      data: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return { success: false, error: "Failed to fetch user details" }
  }
}


export const editUserById = async (userId: string, data: {
  name?: string | null,
  email?: string,
  password?: string | null,
  image?: string | null,
  twoFactorEnabled?: boolean,
  roleName?: "USER" | "ADMIN" | "PUBLICUSER"  // adjust as needed
}) => {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    // Revalidate the path if needed
    revalidatePath("/admin/users")

    return { success: true }
  } catch (error) {
    console.error("Update failed:", error)
    return { success: false, error: "Failed to update user" }
  }
}