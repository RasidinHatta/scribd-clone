import { getAllDocumentWithUserAndComment } from '@/data/document';
import { getAllUserWithRole } from '@/data/user';
import { getAllCommentWithDocAndUser } from '@/data/comment';
import { columns as documentColumns } from '@/components/admin/documents/columns';
import { userColumns } from '@/components/admin/user/columns';
import { commentColumns } from '@/components/admin/comments/columns';
import { DataTable as DocumentTable } from '@/components/admin/documents/data-table';
import { DataTable as UserTable } from '@/components/admin/user/data-table';
import { CommentsDataTable } from '@/components/admin/comments/data-table';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard = ({ title, value }: StatCardProps) => (
  <Card className='bg-primary'>
    <CardHeader>
      <CardDescription className='text-foreground'>{title}</CardDescription>
    </CardHeader>
    <CardContent>
      <CardTitle className="text-2xl">{value}</CardTitle>
    </CardContent>
  </Card>
);

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Section = ({ title, description, children }: SectionProps) => (
  <section>
    <Heading title={title} description={description} />
    <Separator className="my-4" />
    {children}
  </section>
);

const AdminPage = async () => {
  const [documents, users, comments] = await Promise.all([
    getAllDocumentWithUserAndComment(),
    getAllUserWithRole(),
    getAllCommentWithDocAndUser(),
  ]);

  // Handle null case for users
  const safeUsers = users ?? [];
  
  const stats = [
    { title: 'Total Users', value: safeUsers.length },
    { title: 'Total Documents', value: documents.length },
    { title: 'Total Comments', value: comments.length },
  ];

  return (
    <div className="p-4 space-y-12">
      {/* Analytics Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </section>

      {/* Community Documents Table */}
      <Section title="Community Documents" description="Manage community documents">
        <DocumentTable columns={documentColumns} data={documents} />
      </Section>

      {/* User List Table */}
      <Section title="User List" description="Manage users and their roles">
        <UserTable columns={userColumns} data={safeUsers} />
      </Section>

      {/* Comment List Table */}
      <Section title="Comment List" description="Manage all comments">
        <CommentsDataTable columns={commentColumns} data={comments} />
      </Section>
    </div>
  );
};

export default AdminPage;