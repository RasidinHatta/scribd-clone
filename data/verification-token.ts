import db from "@/prisma/prisma"

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: {
                token
            }
        })
        return twoFactorToken
    } catch (error) {
        console.log("twoFactorToken", error)
    }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: {
                email
            }
        })
        return twoFactorToken
    } catch (error) {
        console.log("twoFactorToken", error)
    }
}

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: {
                userId
            }
        })

        return twoFactorConfirmation
    } catch (error) {
        console.log("twoFactorConfirmation", error)
    }
}

export const getVerificationTokenByEmail = async (email: string) => {
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

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: {
                token: token
            }
        })

        return verificationToken;
    } catch (error) {
        console.log(error);
    }

}