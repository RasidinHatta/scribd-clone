import db from "@/prisma/prisma"

export const getAllCommentWithDocAndUser = async () => {
    const comment = await db.comment.findMany({
        include: {
            user: true,
            document: true,
            parent: true,
            replies: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    })
    return comment
}