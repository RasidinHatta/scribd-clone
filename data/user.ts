import db from "@/prisma/prisma"
import { startOfMonth, subMonths } from "date-fns"

//source : /data/user.ts

/**
 * Fetches all users from the database.
 * @returns Array of user objects or null if an error occurs.
 */
// /data/user.ts

/**
 * Fetches all users except those with the "ADMIN" role.
 * Results are sorted by name in ascending order.
 * @returns Array of user objects or null if an error occurs.
 */
export const getAllUserWithRole = async () => {
    return await db.user.findMany({
        where: {
            NOT: {
                roleName: "ADMIN",
            },
        },
        orderBy: {
            name: "asc",
        },
    });
};

/**
 * Fetches a user by their unique ID, including their role information.
 * @param id - The user's unique identifier.
 * @returns User object with role info or null if not found or error occurs.
 */
export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
            include: {
                role: true, // ✅ This is required to get `role.name`
            }
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

/**
 * Fetches a user by their email address.
 * Converts email to lowercase before querying.
 * @param email - The user's email address.
 * @returns User object or null if not found or error occurs.
 */
export const getUserByEmail = async (email: string) => {
    try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await db.user.findUnique({
            where: {
                email: lowerCaseEmail
            }
        })

        return user;
    } catch (error) {
        return null
    }
}