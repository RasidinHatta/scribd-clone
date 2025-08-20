/**
 * Source: /components/documents/columns.tsx
 *
 * Document table column definitions with sorting, formatting, and skeletons.
 */

"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import DocumentActionCell from "./action-cell"
import { Document, User } from "@/lib/generated/prisma/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

type DocumentWithUser = Document & {
  user: User
}

// -----------------------------
// Skeletons
// -----------------------------
const TitleSkeleton = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-4 rounded-full" />
  </div>
)

const DescriptionSkeleton = () => (
  <div className="pl-6 border-l-2 border-muted-foreground/30">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3 mt-1" />
  </div>
)

const BasicSkeleton = () => <Skeleton className="h-4 w-3/4" />
const UserSkeleton = () => (
  <div className="space-y-1">
    <Skeleton className="h-3 w-4/5" />
    <Skeleton className="h-3 w-3/5" />
  </div>
)
const DateSkeleton = () => <Skeleton className="h-4 w-16" />
const ActionsSkeleton = () => (
  <div className="flex space-x-2">
    <Skeleton className="h-8 w-8 rounded-md" />
    <Skeleton className="h-8 w-8 rounded-md" />
    <Skeleton className="h-8 w-8 rounded-md" />
  </div>
)

// -----------------------------
// Reusable header
// -----------------------------
const SortableHeader = ({ column, label }: { column: any; label: string }) => (
  <Button
    className="bg-accent-background rounded-md text-foreground hover:bg-primary"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
)

// -----------------------------
// Formatters
// -----------------------------
const formatDateDDMMYYYY = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

// -----------------------------
// Columns
// -----------------------------
export const columns: ColumnDef<DocumentWithUser>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <TitleSkeleton />
      return <span className="font-medium text-sm">{value}</span>
    },
    enableSorting: true,
    size: 320,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue() as string | undefined
      const maxLength = 50

      if (description === undefined) return <DescriptionSkeleton />
      if (!description) return <span className="text-muted-foreground/50">No description</span>

      const truncated =
        description.length > maxLength ? `${description.substring(0, maxLength)}...` : description

      return (
        <div className="pl-6 border-l-2 border-muted-foreground/30">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="line-clamp-2 text-sm">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-[300px]">
              <p className="break-words">{description}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
    size: 360,
  },
  {
    accessorKey: "subject",
    header: ({ column }) => <SortableHeader column={column} label="Subject" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <BasicSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
    size: 160,
  },
  {
    accessorKey: "format",
    header: ({ column }) => <SortableHeader column={column} label="Format" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <BasicSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "user",
    header: "Uploaded By",
    cell: ({ row }) => {
      const user = row.original.user
      if (!user?.name || !user?.email) return <UserSkeleton />
      return <span className="text-sm">{`${user.name} (${user.email})`}</span>
    },
    size: 240,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} label="Created" />,
    cell: ({ row }) => {
      const value = row.original.createdAt
      if (!value) return <DateSkeleton />
      return <span className="text-xs text-muted-foreground">{formatDateDDMMYYYY(new Date(value))}</span>
    },
    enableSorting: true,
    sortingFn: "datetime",
    size: 140,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <SortableHeader column={column} label="Last Edited" />,
    cell: ({ row }) => {
      const value = row.original.updatedAt
      if (!value) return <DateSkeleton />
      return <span className="text-xs text-muted-foreground">{formatDateDDMMYYYY(new Date(value))}</span>
    },
    enableSorting: true,
    sortingFn: "datetime",
    size: 140,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const document = row.original
      if (!document.id || !document.title) return <ActionsSkeleton />

      return <DocumentActionCell documentId={document.id} documentTitle={document.title} />
    },
    size: 120,
  },
]