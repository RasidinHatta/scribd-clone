"use server"

import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import { startOfMonth, subMonths } from "date-fns"

/**
 * Deletes a user by their unique ID.
 * After deletion, revalidates the /admin/users path to update the UI.
 * @param userId - The unique identifier of the user to delete.
 * @returns Success status or error message.
 */
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

/**
 * Fetches a user by their unique ID.
 * Converts createdAt and updatedAt to ISO strings for serialization.
 * @param userId - The unique identifier of the user to fetch.
 * @returns Success status and user data, or error message.
 */
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

/**
 * Updates a user's details by their unique ID.
 * Supports updating name, email, password, image, two-factor status, and role.
 * Updates the updatedAt timestamp and revalidates the /admin/users path.
 * @param userId - The unique identifier of the user to update.
 * @param data - Partial user data to update.
 * @returns Success status or error message.
 */
export const editUserById = async (userId: string, data: {
  name?: string | null,
  email?: string,
  password?: string | null,
  image?: string | null,
  twoFactorEnabled?: boolean,
  roleName?: "USER" | "ADMIN" | "PUBLICUSER"
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

/**
 * Fetches users filtered by their role name.
 * Returns basic user info and role description.
 * @param roleName - The role name to filter users by ("ADMIN", "USER", "PUBLICUSER").
 * @returns Success status and array of users, or error message.
 */
export async function getUsersByRoleName(roleName: "ADMIN" | "USER" | "PUBLICUSER") {
  try {
    const users = await db.user.findMany({
      where: {
        roleName,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roleName: true,
        role: {
          select: {
            description: true
          }
        }
      }
    })

    return { success: true, data: users }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to fetch users" }
  }
}




export async function fetchUserStats(mode: "month" | "all") {
  const now = new Date()
  const startThisMonth = startOfMonth(now)
  const startLastMonth = startOfMonth(subMonths(now, 1))

  const thisMonthUsers = await db.user.count({
    where: { roleName: { not: "ADMIN" }, createdAt: { gte: startThisMonth } },
  })

  const lastMonthUsers = await db.user.count({
    where: { roleName: { not: "ADMIN" }, createdAt: { gte: startLastMonth, lt: startThisMonth } },
  })

  const totalUsers = await db.user.count({
    where: { roleName: { not: "ADMIN" } },
  })

  const percentageChange =
    mode === "month"
      ? lastMonthUsers === 0
        ? thisMonthUsers > 0
          ? 100
          : 0
        : ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
      : totalUsers === 0
        ? 0
        : (thisMonthUsers / totalUsers) * 100

  return {
    totalUsers,
    thisMonthUsers,
    lastMonthUsers,
    percentageChange: Math.round(percentageChange),
  }
}