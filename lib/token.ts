import { getTwoFactorTokenByEmail, getVerificationTokenByEmail } from "@/data/verification-token"
import db from "@/prisma/prisma"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString()
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60)

    const existingToken = await getTwoFactorTokenByEmail(email)

    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return twoFactorToken
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date().getTime() + 1000 * 60 * 60

    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    // Create a new verification token
    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires: new Date(expires)
        }
    })

    return verificationToken;
}
