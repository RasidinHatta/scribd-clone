import db from "@/prisma/prisma"

/**
 * Fetches all roles from the database.
 * @returns Array of roles or null if an error occurs.
 */
export const getAllRoles = async () => {
    try {
        const roles = await db.role.findMany()
        return roles
    } catch (error) {
        console.log(error)
        return null
    }
}

/**
 * Fetches all roles except "ADMIN" and includes associated users and user count.
 * @returns Array of roles with user info or null if an error occurs.
 */
export const getAllRolesWithUSer = async () => {
    try {
        const roles = await db.role.findMany({
            where: {
                NOT: {
                    name: "ADMIN"
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
        });
        return roles;
    } catch (error) {
        console.log(error);
        return null;
    }
};

/**
 * Fetches a role by its unique ID.
 * @param id - The role's unique identifier.
 * @returns The role object or null if not found or error occurs.
 */
export const getRoleById = async (id: string) => {
    try {
        const role = await db.role.findFirst({
            where: {
                id
            }
        })
        return role
    } catch (error) {
        console.log(error)
        return null
    }
}

/**
 * Returns a map of role IDs to role names.
 * @returns An object mapping role IDs to names, or empty object if error occurs.
 */
export const getRoleMap = async () => {
    try {
        const roles = await db.role.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        const roleMap: Record<string, string> = {};

        for (const role of roles) {
            roleMap[role.id] = role.name;
        }

        return roleMap;
    } catch (error) {
        console.error(error);
        return {};
    }
};
