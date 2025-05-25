"use client"

import { useEffect, useState } from "react"
import { getUsersByRoleName } from "@/actions/admin/user"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface RoleUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleName: "ADMIN" | "USER" | "PUBLICUSER"
}

interface User {
  id: string
  name: string | null
  email: string
  roleName: "ADMIN" | "USER" | "PUBLICUSER"
  role: {
    description: string | null
  }
}

const RoleUserDialog = ({ open, onOpenChange, roleName }: RoleUserDialogProps) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return

    const fetchUsers = async () => {
      setLoading(true)
      const result = await getUsersByRoleName(roleName)
      if (result.success && result.data) {
        setUsers(result.data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [roleName, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Users with Role: {roleName}</DialogTitle>
          <DialogDescription>
            Below is the list of users assigned to the <strong>{roleName}</strong> role.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8 text-sm">Loading...</div>
        ) : users.length === 0 ? (
          <div className="flex justify-center py-8 text-sm">No users found.</div>
        ) : (
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="rounded border p-4 shadow-sm">
                <p className="text-sm font-medium">{user.name || "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.role.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.role.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RoleUserDialog
