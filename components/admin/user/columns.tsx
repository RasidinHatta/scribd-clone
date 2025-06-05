"use client"

import { User } from "@/lib/generated/prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ActionCell from "./action-cell"

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "emailVerified",
    header: "Verified?",
    cell: ({ row }) => (row.original.emailVerified ? "Yes" : "No"),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image
      return image ? (
        <img src={image} alt="avatar" className="w-8 h-8 rounded-full" />
      ) : (
        "No Image"
      )
    },
  },
  {
    accessorKey: "twoFactorEnabled",
    header: "TwoFactor",
    cell: ({ row }) => (row.original.twoFactorEnabled ? "Enabled" : "Disabled"),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Join Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(),
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) =>
      new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <ActionCell
        userId={row.original.id}
        userName={row.original.name || ""}
        userEmail={row.original.email}
        userRole={row.original.roleName}
      />
    ),
  },
]
