import { getUserById } from '@/data/user'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type UserPageProps = {
  params: Promise<{ id: string }>
}

const UserPage = async ({ params }: UserPageProps) => {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>User Detail</CardTitle>
        <CardDescription>Details for user ID: {user.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Role:</strong> {user.roleName}
        </div>
        <div>
          <strong>Email Verified:</strong>{' '}
          {user.emailVerified
            ? new Date(user.emailVerified).toLocaleDateString()
            : 'Not verified'}
        </div>
        <div>
          <strong>Two Factor Authentication:</strong>{' '}
          {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
        </div>
        <div>
          <strong>Created At:</strong>{' '}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Updated At:</strong>{' '}
          {new Date(user.updatedAt).toLocaleDateString()}
        </div>
        <div>
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.name}'s avatar`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-primary">
              No Image
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserPage