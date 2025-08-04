/**
 * Source: /components/admin/documents/columns.tsx
 *
 * This file defines the column configuration for the admin documents table.
 * It includes sorting, formatting, and custom cell rendering for document data.
 * The DocumentActionCell component provides row-level actions (view, edit, delete, comments).
 */

"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import DocumentActionCell from "./action-cell"
import { Document, User } from "@/lib/generated/prisma/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type DocumentWithUser = Document & {
    user: User
}


export const columns: ColumnDef<DocumentWithUser>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const { description } = row.original
            const maxLength = 50

            if (!description) {
                return <span className="text-muted-foreground/50">No description</span>;
            }

            const truncated = description.length > maxLength
                ? `${description.substring(0, maxLength)}...`
                : description

            return (
                <div className="pl-6 border-l-2 border-muted-foreground/30">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="line-clamp-2 text-sm">
                                {truncated}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" className="max-w-[300px]">
                            <p className="break-words">{description}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )
        },
        size: 300,
    },
    {
        accessorKey: "subject",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "format",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Format
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "user",
        header: "Uploaded By",
        cell: ({ row }) => {
            const user = row.original.user
            return `${user.name} (${user.email})`
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString()
        },
        enableSorting: true,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Last Edited
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return new Date(row.original.updatedAt).toLocaleDateString()
        },
        enableSorting: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const document = row.original;
            return (
                <DocumentActionCell
                    documentId={document.id}
                    documentTitle={document.title}
                />
            );
        },
    }
]