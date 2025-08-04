/**
 * Source: /app/(admin)/admin/users/page.tsx
 *
 * This page displays the admin user list.
 * It fetches all users except admins, then renders them in a DataTable with column configuration.
 * Metadata is set for SEO and page info.
 */

import { userColumns } from '@/components/admin/user/columns'
import { DataTable } from '@/components/admin/user/data-table'
import { getAllUserWithRole } from '@/data/user'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Users | SAMS",
  description: "A document sharing platform with community discussions",
}

const UserPage = async () => {
  // Fetch all users except admins for display
  const userList = (await getAllUserWithRole()) ?? []

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">User List</h1>
      <DataTable columns={userColumns} data={userList}/>
    </div>
  )
}

export default UserPage
