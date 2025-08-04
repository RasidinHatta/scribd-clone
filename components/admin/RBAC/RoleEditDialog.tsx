// RoleEditDialog.tsx
"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Role } from "@/lib/generated/prisma/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { editRoleById } from "@/actions/admin/role"

/**
 * Props for the RoleEditDialog component
 * @param role - The role object to edit
 * @param open - Boolean to control dialog visibility
 * @param onOpenChange - Callback for dialog visibility changes
 * @param onRoleUpdated - Optional callback when role is successfully updated
 */
interface RoleEditDialogProps {
    role: Role
    open: boolean
    onOpenChange: (open: boolean) => void
    onRoleUpdated?: (updatedRole: Role) => void
}

/**
 * A dialog component for editing role details and permissions
 * Allows updating role description and various document/comment permissions
 */
export function RoleEditDialog({ role, open, onOpenChange, onRoleUpdated }: RoleEditDialogProps) {
    const [isPending, startTransition] = useTransition()

    // Form state management
    const [name, setName] = useState(role.name)
    const [description, setDescription] = useState(role.description || "")
    const [documentPermissions, setDocumentPermissions] = useState({
        create: role.createDocument,
        read: role.readDocument,
        update: role.updateDocument,
        delete: role.deleteDocument,
    })
    const [commentPermissions, setCommentPermissions] = useState({
        create: role.createComment,
        read: role.readComment,
        update: role.updateComment,
        delete: role.deleteComment,
    })

    /**
     * Handles form submission to update role
     * @param e - Form event
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const result = await editRoleById(role.id, {
                name,
                description,
                createDocument: documentPermissions.create,
                readDocument: documentPermissions.read,
                updateDocument: documentPermissions.update,
                deleteDocument: documentPermissions.delete,
                createComment: commentPermissions.create,
                readComment: commentPermissions.read,
                updateComment: commentPermissions.update,
                deleteComment: commentPermissions.delete,
            })

            if (result.success && result.data) {
                toast.success("Role updated successfully")
                onRoleUpdated?.(result.data)
            } else {
                toast.error(result.error || "Failed to update role")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>
                        Update role details and permissions below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Role Name
                            </Label>
                            <Input id="name" value={name} disabled />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                placeholder="Optional description"
                            />
                        </div>

                        {/* Document Permissions Section */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Document Permissions</Label>
                            <div className="col-span-3 space-y-2">
                                {["create", "read", "update", "delete"].map((action) => (
                                    <div key={action} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${action}-doc`}
                                            checked={documentPermissions[action as keyof typeof documentPermissions]}
                                            onCheckedChange={(checked) =>
                                                setDocumentPermissions((prev) => ({
                                                    ...prev,
                                                    [action]: !!checked,
                                                }))
                                            }
                                        />
                                        <Label htmlFor={`${action}-doc`}>
                                            {`${action.charAt(0).toUpperCase() + action.slice(1)} Documents`}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comment Permissions Section */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Comment Permissions</Label>
                            <div className="col-span-3 space-y-2">
                                {["create", "read", "update", "delete"].map((action) => (
                                    <div key={action} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${action}-comment`}
                                            checked={commentPermissions[action as keyof typeof commentPermissions]}
                                            onCheckedChange={(checked) =>
                                                setCommentPermissions((prev) => ({
                                                    ...prev,
                                                    [action]: !!checked,
                                                }))
                                            }
                                        />
                                        <Label htmlFor={`${action}-comment`}>
                                            {`${action.charAt(0).toUpperCase() + action.slice(1)} Comments`}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}