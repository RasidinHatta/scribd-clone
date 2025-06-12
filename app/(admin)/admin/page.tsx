import React from 'react';
import { getAllDocumentWithUserAndComment } from '@/data/document';
import { columns as documentColumns } from '@/components/admin/documents/columns';
import { getAllUserWithRole } from '@/data/user';
import { userColumns } from '@/components/admin/user/columns';
import { DataTable as DocumentTable } from '@/components/admin/documents/data-table'
import { DataTable as UserTable } from '@/components/admin/user/data-table'
import { CommentsDataTable } from '@/components/admin/comments/data-table';
import { commentColumns } from '@/components/admin/comments/columns';
import { getAllCommentWithDocAndUser } from '@/data/comment';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';

const AdminPage = async () => {
  const documents = await getAllDocumentWithUserAndComment();
  const users = (await getAllUserWithRole()) ?? [];
  const comments = await getAllCommentWithDocAndUser();

  return (
    <div className="p-4 space-y-12">
      {/* Analytics Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{users.length}</CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Documents</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{documents.length}</CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Comments</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{comments.length}</CardTitle>
          </CardContent>
        </Card>
      </section>

      {/* Community Documents Table */}
      <section>
        <Heading title="Community Documents" description="Manage community documents" />
        <Separator className="my-4" />
        <DocumentTable columns={documentColumns} data={documents} />
      </section>

      {/* User List Table */}
      <section>
        <Heading title="User List" description="Manage users and their roles" />
        <Separator className="my-4" />
        <UserTable columns={userColumns} data={users} />
      </section>

      {/* Comment List Table */}
      <section>
        <Heading title="Comment List" description="Manage all comments" />
        <Separator className="my-4" />
        <CommentsDataTable columns={commentColumns} data={comments} />
      </section>
    </div>
  );
};

export default AdminPage;