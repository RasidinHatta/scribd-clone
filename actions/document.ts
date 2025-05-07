"use server"

import { auth } from "@/auth";
import { DocumentSchema } from "@/lib/schemas";
import db from "@/prisma/prisma";
import * as z from "zod";

export const documentUpload = async (data: z.infer<typeof DocumentSchema>) => {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }
    const userId = session.user.id;
    try {
        const validatedData = DocumentSchema.parse(data);
        const { title, description, url, publicId, format, resourceType } = validatedData;

        await db.document.create({
            data: {
                title,
                description,
                url,
                publicId,
                format,
                resourceType,
                userId,
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

export const getCommunityDocuments = async () => {
    const documents = await db.document.findMany({
        include: { user: true }, // Fetch author details
        orderBy: { createdAt: "desc" }, // Newest first
    });
    return documents;
};


export const getDocumentById = async (id: string) => {
    try {
        const document = await db.document.findUnique({
            where: { id },
            include: { user: true }
        })
        return document
    } catch (error) {
        console.error("Error fetching document:", error)
        return null
    }
}