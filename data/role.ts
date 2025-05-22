import db from "@/prisma/prisma"

export const getAllRoles = async () => {
    try {
        const roles = await db.role.findMany()
        return roles
    } catch (error) {
        console.log(error)
        return null
    }
}

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
