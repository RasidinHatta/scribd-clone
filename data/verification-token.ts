import db from "@/prisma/prisma"

export const getVerificationTokenByEmail = async(email: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: {
                email
            }
        })

        return verificationToken
    } catch (error) {
        console.log(error)
    }
}