import { userColumns } from '@/components/admin/user/columns';
import { DataTable } from '@/components/admin/user/data-table';
import { getAllUserWithRole } from '@/data/user';
import React from 'react'

const UserPage = async () => {
  const userList = await getAllUserWithRole();
  return (
    <div className="p-4">
      {/* Page heading */}
      <h1 className="text-xl font-semibold mb-4">Communities</h1>

      {/* DataTable component that displays the documents */}
      <DataTable
        columns={userColumns}  // Column configuration from columns.tsx
        data={userList}   // Document data fetched from the database
      />
    </div>
  )
}

export default UserPage