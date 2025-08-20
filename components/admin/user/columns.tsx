/**
 * Source: /components/admin/user/columns.tsx
 *
 * Admin user table column definitions with sorting, formatting, and skeletons.
 */

"use client"

import { User } from "@/lib/generated/prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ActionCell from "./action-cell"
import { Skeleton } from "@/components/ui/skeleton"

// -----------------------------
// Skeletons
// -----------------------------
const TextSkeleton = () => <Skeleton className="h-4 w-3/4" />
const RoleSkeleton = () => <Skeleton className="h-4 w-16" />
const VerificationSkeleton = () => <Skeleton className="h-4 w-10" />
const ImageSkeleton = () => <Skeleton className="w-8 h-8 rounded-full" />
const DateSkeleton = () => <Skeleton className="h-4 w-24" />
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
const SortableHeader = ({
  column,
  label,
  size = "default",
}: {
  column: any
  label: string
  size?: "default" | "sm"
}) => (
  <Button
    className="bg-accent-background rounded-md text-foreground hover:bg-primary"
    size={size}
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="ml-2 h-3 w-3" />
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
      if (!value) return <TextSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <TextSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => <SortableHeader column={column} label="Role" />,
    cell: ({ getValue }) => {
      const value = getValue() as string | null
      if (!value) return <RoleSkeleton />
      return <span className="text-sm">{value}</span>
    },
    enableSorting: true,
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => <SortableHeader column={column} label="Verified?" />,
    cell: ({ row }) => {
      const value = row.original.emailVerified
      if (value === undefined) return <VerificationSkeleton />
      return <span className="text-sm">{value ? "Yes" : "No"}</span>
    },
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
  },
  {
    accessorKey: "twoFactorEnabled",
    header: ({ column }) => <SortableHeader column={column} label="TwoFactor" />,
    cell: ({ row }) => {
      const value = row.original.twoFactorEnabled
      if (value === undefined) return <VerificationSkeleton />
      return <span className="text-sm">{value ? "Enabled" : "Disabled"}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} label="Join Date" />,
    cell: ({ row }) => {
      const value = row.original.createdAt
      if (!value) return <DateSkeleton />
      return (
        <span className="text-xs text-muted-foreground">
          {formatDateDDMMYYYY(new Date(value))}
        </span>
      )
    },
    enableSorting: true,
    sortingFn: "datetime",
    size: 160,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <SortableHeader column={column} label="Updated At" />,
    cell: ({ row }) => {
      const value = row.original.updatedAt
      if (!value) return <DateSkeleton />
      return (
        <span className="text-xs text-muted-foreground">
          {formatDateDDMMYYYY(new Date(value))}
        </span>
      )
    },
    sortingFn: "datetime",
    size: 160,
  },
  {
    id: "action",
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