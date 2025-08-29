import { commentColumns } from '@/components/admin/comments/columns'
import { DataTable } from '@/components/admin/comments/data-table';
import { getAllCommentWithDocAndUser } from '@/data/comment';
import React from 'react'

const CommentPage = async () => {
  const comments = await getAllCommentWithDocAndUser();
  return (
    <div className="p-4">
      {/* Page heading */}
      <h1 className="text-xl font-semibold mb-4">Community Comments</h1>

      {/* DataTable component that displays the documents */}
      <DataTable
        columns={commentColumns}  // Column configuration from columns.tsx
        data={comments}   // Document data fetched from the database
      />
    </div>
  )
}

export default CommentPage