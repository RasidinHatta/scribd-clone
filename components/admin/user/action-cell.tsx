/**
 * Source: /components/admin/user/action-cell.tsx
 *
 * This component renders action controls for a user row in the admin panel.
 * It provides dropdown actions to view, edit, or delete a user.
 * Dialogs are used for viewing user details, confirming deletion, and editing user info.
 * User data is fetched and updated via server actions.
 */

"use client"

import { deleteUserById, editUserById, getUserById } from "@/actions/admin/user"
import { Button } from "@/components/ui/button"
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RoleName } from "@/lib/generated/prisma"
import { MoreHorizontal } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

type UserDetails = {
  id: string
  name: string | null
  email: string
  password: string | null
  emailVerified: Date | null
  image: string | null
  twoFactorEnabled: boolean
  roleName: string
  createdAt: Date
  updatedAt: Date
}

function ActionCell({
  userId,
  userName,
  userEmail,
  userRole,
}: {
  userId: string
  userName: string
  userEmail: string
  userRole: RoleName
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(userName)
  const [email] = useState(userEmail)
  const [roleName, setRoleName] = useState(userRole)

  const loadUserDetails = () => {
    startTransition(async () => {
      const res = await getUserById(userId)
      if (res.success && res.data) {
        // Convert string dates back to Date objects
        setUserDetails({
          ...res.data,
          createdAt: new Date(res.data.createdAt),
          updatedAt: new Date(res.data.updatedAt),
          emailVerified: res.data.emailVerified ? new Date(res.data.emailVerified) : null
        })
        setViewOpen(true)
      } else {
        toast.error(res.error || "Failed to load user details")
      }
    })
  }

  const onConfirmDelete = () => {
    startTransition(async () => {
      const res = await deleteUserById(userId)
      if (res.success) {
        toast.success("User deleted successfully")
        setDeleteOpen(false)
      } else {
        toast.error(res.error || "Failed to delete user")
      }
    })
  }

  const onConfirmEdit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await editUserById(userId, { name, roleName })
      if (res.success) {
        toast.success("User updated successfully")
        setEditOpen(false)
      } else {
        toast.error(res.error || "Failed to update user")
      }
    })
  }

  const formatDate = (date: Date | null) => {
    return date ? new Date(date).toLocaleString() : 'Not verified'
  }

  const formatBoolean = (value: boolean) => {
    return value ? 'Yes' : 'No'
  }

  const availableRoles: RoleName[] = ["USER", "PUBLICUSER"];

  return (
    // make container inline so hover/background stays the shape of the button
    <div className="inline-flex items-center hover:bg-primary rounded-md">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* apply rounded + hover + transition to the trigger button (square) */}
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-md hover:bg-primary transition-colors"
            aria-label="Open menu"
            disabled={isPending}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={loadUserDetails}
            disabled={isPending}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setEditOpen(true)}
            disabled={isPending}
          >
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={() => setDeleteOpen(true)}
            disabled={isPending}
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information for {userName}
            </DialogDescription>
          </DialogHeader>
          {userDetails ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {userDetails.name || 'Not provided'}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <p className="col-span-3 text-sm text-muted-foreground break-all">
                  {userDetails.email}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Password</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {userDetails.password ? '******' : 'Not set'}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email Verified</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {formatDate(userDetails.emailVerified)}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Image</Label>
                <p className="col-span-3 text-sm text-muted-foreground break-all">
                  {userDetails.image || 'Not provided'}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">2FA Enabled</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {formatBoolean(userDetails.twoFactorEnabled)}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Role</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {userDetails.roleName}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Created At</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {formatDate(userDetails.createdAt)}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Updated At</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {formatDate(userDetails.updatedAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              {isPending ? 'Loading...' : 'No user details available'}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userName} ({userEmail})? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onConfirmEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                disabled
                className="opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value as RoleName)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ActionCell