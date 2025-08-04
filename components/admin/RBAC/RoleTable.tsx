// RoleTable.tsx
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Role, User } from "@/lib/generated/prisma/client";
import { RoleEditDialog } from "./RoleEditDialog";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import RoleUserDialog from "./RoleUserDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Extended Role type that includes user relationships
 */
export type RoleRelation = Role & {
    users: Pick<User, "id" | "name" | "email">[];
    _count?: {
        users: number;
    };
};

/**
 * Props for RolesTable component
 * @param roles - Array of RoleRelation objects to display
 */
export interface RolesTableProps {
    roles: RoleRelation[];
}

/**
 * Table component for displaying and managing roles
 * Includes functionality for editing roles and viewing assigned users
 */
export function RolesTable({ roles: initialRoles }: RolesTableProps) {
    const [roles, setRoles] = useState(initialRoles);
    const [editOpenRoleId, setEditOpenRoleId] = useState<string | null>(null)
    const [userDialogRoleId, setUserDialogRoleId] = useState<string | null>(null)

    /**
     * Callback for when a role is updated
     * @param updatedRole - The updated role object
     */
    const handleRoleUpdated = (updatedRole: Role) => {
        setRoles((prevRoles) =>
            prevRoles.map((role) =>
                role.id === updatedRole.id ? { ...role, ...updatedRole } : role
            )
        );
    };

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
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                {role.name}
                            </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>{role.description || "-"}</span>
                                    </TooltipTrigger>
                                    {role.description && (
                                        <TooltipContent>
                                            <p>{role.description}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1 flex-wrap">
                                {role.createDocument && <Badge variant="outline">Create</Badge>}
                                {role.readDocument && <Badge variant="outline">Read</Badge>}
                                {role.updateDocument && <Badge variant="outline">Update</Badge>}
                                {role.deleteDocument && <Badge variant="outline">Delete</Badge>}
                                {!role.createDocument &&
                                    !role.readDocument &&
                                    !role.updateDocument &&
                                    !role.deleteDocument && (
                                        <span className="text-muted-foreground">None</span>
                                    )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1 flex-wrap">
                                {role.createComment && <Badge variant="outline">Create</Badge>}
                                {role.readComment && <Badge variant="outline">Read</Badge>}
                                {role.updateComment && <Badge variant="outline">Update</Badge>}
                                {role.deleteComment && <Badge variant="outline">Delete</Badge>}
                                {!role.createComment &&
                                    !role.readComment &&
                                    !role.updateComment &&
                                    !role.deleteComment && (
                                        <span className="text-muted-foreground">None</span>
                                    )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{role._count?.users || 0} users</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            {/* Actions dropdown menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onSelect={() => setEditOpenRoleId(role.id)}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onSelect={() => setUserDialogRoleId(role.id)}
                                    >
                                        View Users
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Edit Role Dialog */}
                            <RoleEditDialog
                                role={role}
                                open={editOpenRoleId === role.id}
                                onOpenChange={(open) => {
                                    if (!open) setEditOpenRoleId(null)
                                }}
                                onRoleUpdated={handleRoleUpdated}
                            />

                            {/* View Users Dialog */}
                            <RoleUserDialog
                                open={userDialogRoleId === role.id}
                                onOpenChange={(open) => {
                                    if (!open) setUserDialogRoleId(null)
                                }}
                                roleName={role.name as "ADMIN" | "USER" | "PUBLICUSER"}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}