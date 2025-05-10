"use server"

import { auth } from "@/auth"
import { UserImageSchema } from "@/lib/schemas"
import db from "@/prisma/prisma"
import * as z from "zod"

const cloudinaryAppName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export const userImageUpload = async (data: z.infer<typeof UserImageSchema>) => {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }
    const userId = session.user.id;

    try {
        const validatedData = UserImageSchema.parse(data);
        const { publicId,format } = validatedData;
        const url = `https://res.cloudinary.com/${cloudinaryAppName}/image/upload/${publicId}.${format}`

        await db.user.update({
            where: {
                id: userId
            },
            data: {
                image: url,
            }
        });

        return { success: "Document uploaded successfully!" };
    } catch (error) {
        console.error("Upload error:", error);

        if ((error as { code: string }).code === "ETIMEDOUT") {
            return {
                error: "Unable to connect to the database. Please try again later.",
            };
        } else if ((error as { code: string }).code === "503") {
            return {
                error: "Service temporarily unavailable. Please try again later.",
            };
        } else {
            return {
                error: "An unexpected error occurred. Please try again later.",
            };
        }
    }
}