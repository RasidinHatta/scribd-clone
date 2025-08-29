/**
 * Source: /components/admin/user/columns.tsx
 *
 * Admin user table column definitions with sorting, formatting, tooltips, and skeletons.
 */

"use client"

import { RoleName, User } from "@/lib/generated/prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import ActionCell from "./action-cell"

// -----------------------------
// Skeletons
// -----------------------------
const BasicSkeleton = () => <Skeleton className="h-4 w-3/4" />
const RoleSkeleton = () => <Skeleton className="h-4 w-16" />
const VerificationSkeleton = () => <Skeleton className="h-4 w-10" />
const ImageSkeleton = () => <Skeleton className="w-8 h-8 rounded-full" />
const DateSkeleton = () => (
  <div className="space-y-1">
    <Skeleton className="h-3 w-12" />
    <Skeleton className="h-3 w-10" />
  </div>
)
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
export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <BasicSkeleton />
      return <span className="text-sm font-medium">{value}</span>
    },
    enableSorting: true,
    size: 180,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <BasicSkeleton />
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm line-clamp-1">{value}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{value}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
    enableSorting: true,
    size: 220,
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => <SortableHeader column={column} label="Role" />,
    cell: ({ getValue }) => {
      const value = getValue() as RoleName
      if (!value) return <RoleSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => <SortableHeader column={column} label="Verified?" />,
    cell: ({ row }) => {
      const value = row.original.emailVerified
      if (value === undefined) return <VerificationSkeleton />
      return <span className="text-sm">{value ? "Yes" : "No"}</span>
    },
    size: 100,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image
      if (image === undefined) return <ImageSkeleton />
      return image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <span className="text-sm text-muted-foreground">No Image</span>
      )
    },
    size: 100,
  },
  {
    accessorKey: "twoFactorEnabled",
    header: ({ column }) => <SortableHeader column={column} label="TwoFactor" />,
    cell: ({ row }) => {
      const value = row.original.twoFactorEnabled
      if (value === undefined) return <VerificationSkeleton />
      return <span className="text-sm">{value ? "Enabled" : "Disabled"}</span>
    },
    size: 120,
  },
  {
    id: "dates",
    header: ({ column }) => <SortableHeader column={column} label="Dates" />,
    cell: ({ row }) => {
      const { createdAt, updatedAt } = row.original
      if (!createdAt || !updatedAt) return <DateSkeleton />

      const createdDate = new Date(createdAt)
      const updatedDate = new Date(updatedAt)

      return (
        <div className="space-y-1 text-xs text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <span className="font-medium">C:</span>
                <span>{formatDateDDMMYYYY(createdDate)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Created: {createdDate.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <span className="font-medium">U:</span>
                <span>{formatDateDDMMYYYY(updatedDate)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Updated: {updatedDate.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.updatedAt)
      const dateB = new Date(rowB.original.updatedAt)
      return dateA.getTime() - dateB.getTime()
    },
    size: 180,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      if (!user.id || !user.email) return <ActionsSkeleton />

      return (
        <ActionCell
          userId={user.id}
          userName={user.name || ""}
          userEmail={user.email}
          userRole={user.roleName}
        />
      )
    },
    size: 120,
  },
]