"use server"

import db from "@/prisma/prisma"

export const getCommentById = async (commentId: string) => {
    try {
        const comment = await db.comment.findUnique({
            where: {
                id: commentId,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                parentId: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    },
                },
                document: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        })

        if (!comment) {
            return { success: false, error: "Comment not found" }
        }

        return {
            success: true,
            data: {
                ...comment,
                isReply: !!comment.parentId,
            },
        }
    } catch (error) {
        console.error("Error fetching comment:", error)
        return { success: false, error: "Failed to fetch comment" }
    }
}

export const getUserById = async (userId: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
                email: true,
            },
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        return { success: true, data: user }
    } catch (error) {
        console.error("Error fetching user:", error)
        return { success: false, error: "Failed to fetch user" }
    }
}

// You already have getDocumentByCommentId
export const getDocumentByCommentId = async (commentId: string) => {
    try {
        const result = await db.comment.findUnique({
            where: {
                id: commentId,
            },
            select: {
                document: {
                    select: {
                        title: true,
                        publicId: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        })

        if (!result?.document) {
            return { success: false, error: "Comment or document not found" }
        }

        return {
            success: true,
            data: {
                title: result.document.title,
                publicId: result.document.publicId,
                userName: result.document.user.name,
                userEmail: result.document.user.email
            }
        }
    } catch (error) {
        console.error("Error fetching document by comment ID:", error)
        return { success: false, error: "Failed to fetch document" }
    }
}

export const getRepliesByCommentId = async (commentId: string) => {
    try {
        const replies = await db.comment.findMany({
            where: {
                parentId: commentId, // Find all comments where parentId matches the commentId
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc', // Order replies by creation date (oldest first)
            },
        })

        return {
            success: true,
            data: replies.map(reply => ({
                ...reply,
                // Ensure user object exists even if user was deleted
                user: reply.user || { id: 'deleted-user', name: 'Deleted User', email: '' }
            })),
        }
    } catch (error) {
        console.error("Error fetching replies:", error)
        return { success: false, error: "Failed to fetch replies" }
    }
}