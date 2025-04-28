import db from "@/prisma/prisma"

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: {
                userId
            }
        })
        return account
    } catch (error) {
        console.log(error)
        return null
    }
}