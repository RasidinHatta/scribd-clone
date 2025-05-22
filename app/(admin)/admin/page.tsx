import React from 'react';
import { getCommunityDocuments } from '@/data/document';
import { columns as documentColumns } from '@/components/admin/documents/columns';
import { getAllUserWithRole } from '@/data/user';
import { userColumns } from '@/components/admin/user/columns';
import { DataTable as DocumentTable } from '@/components/admin/documents/data-table'
import { DataTable as UserTable } from '@/components/admin/user/data-table'

const AdminPage = async () => {
  const documents = await getCommunityDocuments();
  const users = (await getAllUserWithRole()) ?? [];

  return (
    <div className="p-4 space-y-12">
      {/* Analytics Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card text-card-foreground shadow p-4">
          <h2 className="text-sm text-muted-foreground">Total Users</h2>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-2xl border bg-card text-card-foreground shadow p-4">
          <h2 className="text-sm text-muted-foreground">Total Documents</h2>
          <p className="text-2xl font-bold">{documents.length}</p>
        </div>
      </section>

      {/* Community Documents Table */}
      <section>
        <h1 className="text-xl font-semibold mb-4">Community Documents</h1>
        <DocumentTable columns={documentColumns} data={documents} />
      </section>

      {/* User List Table */}
      <section>
        <h1 className="text-xl font-semibold mb-4">User List</h1>
        <UserTable columns={userColumns} data={users} />
      </section>
    </div>
  );
};

export default AdminPage;
