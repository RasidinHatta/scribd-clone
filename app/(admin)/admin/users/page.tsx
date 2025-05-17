import { getAllUser } from '@/data/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

const UserPage = async () => {
  const userList = (await getAllUser()) ?? [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">User List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified?</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>TwoFactor</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.emailVerified ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {user.image ? (
                  <img src={user.image} alt={`${user.name} avatar`} className="w-8 h-8 rounded-full" />
                ) : (
                  'No Image'
                )}
              </TableCell>
              <TableCell>{user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <a href="#" className="text-primary hover:underline">...</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserPage;
