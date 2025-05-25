import { commentColumns } from '@/components/admin/comments/columns';
import { CommentsDataTable } from '@/components/admin/comments/data-table';
import { getAllCommentWithDocAndUser } from '@/data/comment';
import React from 'react'

const CommentPage = async () => {
  const comments = await getAllCommentWithDocAndUser();
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Community Documents</h1>
      <CommentsDataTable columns={commentColumns} data={comments} />
    </div>
  )
}

export default CommentPage