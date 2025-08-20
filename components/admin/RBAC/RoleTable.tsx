// RolesTable.tsx
"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Role, User } from "@/lib/generated/prisma/client"
import { RoleEditDialog } from "./RoleEditDialog"
import RoleUserDialog from "./RoleUserDialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

/**
 * Extended Role type that includes user relationships
 */
export type RoleRelation = Role & {
    users: Pick<User, "id" | "name" | "email">[]
    _count?: {
        users: number
    }
}

/**
 * Props for RolesTable component
 */
export interface RolesTableProps {
    roles: RoleRelation[]
}

/**
 * Table component for displaying and managing roles
 */
export function RolesTable({ roles: initialRoles }: RolesTableProps) {
    const [roles, setRoles] = useState(initialRoles)
    const [editOpenRoleId, setEditOpenRoleId] = useState<string | null>(null)
    const [userDialogRoleId, setUserDialogRoleId] = useState<string | null>(null)

    /**
     * Handle role update
     */
    const handleRoleUpdated = (updatedRole: Role) => {
        setRoles((prevRoles) =>
            prevRoles.map((role) =>
                role.id === updatedRole.id ? { ...role, ...updatedRole } : role
            )
        )
    }

    const renderBadges = (perms: [boolean | undefined, string][]) => (
        <div className="flex gap-1 flex-wrap">
            {perms.some(([enabled]) => !!enabled) ? (
                perms.map(
                    ([enabled, label]) =>
                        enabled && (
                            <Badge key={label} className="bg-primary text-background">
                                {label}
                            </Badge>
                        )
                )
            ) : (
                <span className="text-muted-foreground">None</span>
            )}
        </div>
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Role Name</TableHead>
                    <TableHead className="w-[200px]">Description</TableHead>
                    <TableHead>Document Permissions</TableHead>
                    <TableHead>Comment Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {roles.map((role) => (
                    <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>

                        <TableCell className="max-w-[200px] truncate">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>{role.description || "—"}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {role.description || "No description"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>

                        <TableCell>
                            {renderBadges([
                                [role.createDocument, "Create"],
                                [role.readDocument, "Read"],
                                [role.updateDocument, "Update"],
                                [role.deleteDocument, "Delete"],
                            ])}
                        </TableCell>

                        <TableCell>
                            {renderBadges([
                                [role.createComment, "Create"],
                                [role.readComment, "Read"],
                                [role.updateComment, "Update"],
                                [role.deleteComment, "Delete"],
                            ])}
                        </TableCell>

                        <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUserDialogRoleId(role.id)}
                            >
                                {role._count?.users || 0} Users
                            </Button>

                            {/* Pass roleName to RoleUserDialog (matches your component's expected props) */}
                            <RoleUserDialog
                                open={userDialogRoleId === role.id}
                                onOpenChange={(open) => setUserDialogRoleId(open ? role.id : null)}
                                roleName={role.name as "USER" | "PUBLICUSER"}
                            />
                        </TableCell>

                        <TableCell className="text-right">
                            <div className="inline-flex items-center hover:bg-primary rounded-md">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setEditOpenRoleId(role.id)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <RoleEditDialog
                                role={role}
                                open={editOpenRoleId === role.id}
                                onOpenChange={(open) => setEditOpenRoleId(open ? role.id : null)}
                                onRoleUpdated={handleRoleUpdated}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}