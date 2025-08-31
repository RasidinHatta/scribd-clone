import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleManagementCard from '@/components/admin/RBAC/RoleManagementCard';

export const metadata: Metadata = {
  title: "Settings | SAMS",
  description: "A document sharing platform with community discussions",
};

const SettingPage = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold mb-4">Admin Settings</h1>


      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleManagementCard />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Access Control & Security</CardTitle>
        </CardHeader>
        <CardContent>
          Configure 2FA, session timeout, password policy, and IP restrictions.
        </CardContent>
      </Card>

      {/* Other settings cards */}
    </div>
  );
};

export default SettingPage;