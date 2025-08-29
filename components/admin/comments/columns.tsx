/**
 * Source: /components/admin/comment/columns.tsx
 *
 * Admin comment table column definitions with sorting, formatting, tooltips, and skeletons.
 */

"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Comment, User, Document } from "@/lib/generated/prisma/client"
import { CommentActionCell } from "./action-cell"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// -----------------------------
// Types
// -----------------------------
export type CommentWithRelations = Comment & {
  user: Pick<User, "id" | "name" | "email">
  document: Pick<Document, "id" | "title">
  parent?: Pick<Comment, "id" | "content"> | null
  replies?: Array<Pick<Comment, "id" | "content" | "createdAt" | "userId">>
  _count?: {
    replies?: number
  }
  repliesCount?: number
}

// -----------------------------
// Skeletons
// -----------------------------
const ContentSkeleton = ({ isReply = false }: { isReply?: boolean }) => (
  <div className={isReply ? "pl-6 border-l-2 border-muted-foreground/30" : ""}>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3 mt-1" />
  </div>
)

const AuthorSkeleton = () => (
  <div className="space-y-1">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-3 w-24" />
  </div>
)

const DocumentSkeleton = () => <Skeleton className="h-4 w-32" />
const ReplyToSkeleton = () => <Skeleton className="h-5 w-16" />
const RepliesSkeleton = () => <Skeleton className="h-5 w-12" />
const DateSkeleton = () => <Skeleton className="h-3 w-24" />
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
const formatDateTime = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  const formattedHours = hours.toString().padStart(2, "0")

  return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`
}

const formatDateDDMMYYYY = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

// -----------------------------
// Columns
// -----------------------------
export const commentColumns: ColumnDef<CommentWithRelations>[] = [
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row, getValue }) => {
      const content = getValue() as string
      const parentId = row.original.parentId

      if (content === undefined) return <ContentSkeleton isReply={!!parentId} />

      const maxLength = 50
      const truncated =
        content.length > maxLength ? `${content.substring(0, maxLength)}...` : content

      return (
        <div className={parentId ? "pl-6 border-l-2 border-muted-foreground/30" : ""}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="line-clamp-2 text-sm">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-[300px]">
              <p className="break-words">{content}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
    size: 300,
  },
  {
    accessorKey: "user",
    header: ({ column }) => <SortableHeader column={column} label="Author" size="sm" />,
    cell: ({ row }) => {
      const user = row.original.user
      if (!user?.name && !user?.email) return <AuthorSkeleton />

      return (
        <div className="space-y-1">
          <p className="font-medium text-sm">{user.name || "Anonymous"}</p>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>
      )
    },
    size: 200,
  },
  {
    id: "documentTitle",
    accessorKey: "document.title",
    header: ({ column }) => <SortableHeader column={column} label="Document" size="sm" />,
    cell: ({ row }) => {
      const title = row.original.document?.title
      if (title === undefined) return <DocumentSkeleton />

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm line-clamp-1 hover:text-primary transition-colors">
              {title}
            </p>
          </TooltipTrigger>
          <TooltipContent side="top" align="start">
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
    size: 200,
  },
  {
    accessorKey: "parent",
    header: "Reply To",
    cell: ({ row }) => {
      const parent = row.original.parent
      if (parent === undefined) return <ReplyToSkeleton />
      if (!parent) return <span className="text-muted-foreground text-sm">—</span>

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-xs font-normal max-w-[120px] truncate">
              {parent.content.substring(0, 20)}
              {parent.content.length > 20 ? "..." : ""}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" className="max-w-[300px]">
            <p className="break-words">{parent.content}</p>
          </TooltipContent>
        </Tooltip>
      )
    },
    size: 150,
  },
  {
    accessorKey: "_count.replies",
    header: "Replies",
    cell: ({ row }) => {
      const replies = row.original
      if (replies === undefined) return <RepliesSkeleton />

      const directRepliesCount = row.original.replies?.length || 0
      const prismaRepliesCount = row.original._count?.replies || 0
      const replyCount = Math.max(directRepliesCount, prismaRepliesCount)

      return replyCount > 0 ? (
        <Badge variant="secondary" className="text-xs">
          {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">None</span>
      )
    },
    size: 100,
  },
  {
    id: "dates",
    header: ({ column }) => <SortableHeader column={column} label="Dates" />,
    cell: ({ row }) => {
      const { createdAt, updatedAt } = row.original
      if (!createdAt || !updatedAt) return <DateSkeleton />

      const createdDate = new Date(createdAt)
      const updatedDate = new Date(updatedAt)
      const wasEdited = updatedDate.getTime() > createdDate.getTime() + 1000

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
              <p>Created: {formatDateTime(createdDate)}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <span className="font-medium">U:</span>
                <span>
                  {wasEdited ? formatDateDDMMYYYY(updatedDate) : "—"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {wasEdited ? (
                <p>Updated: {formatDateTime(updatedDate)}</p>
              ) : (
                <p>Not edited</p>
              )}
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
    size: 140, // compact combined column
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const comment = row.original
      if (!comment.id || !comment.content || !comment.user?.id || !comment.document?.title) {
        return <ActionsSkeleton />
      }

      return (
        <CommentActionCell
          commentId={comment.id}
          content={comment.content}
          isReply={!!comment.parentId}
          userId={comment.user.id}
          hasReplies={!!comment.replies}
          documentTitle={comment.document.title}
        />
      )
    },
    size: 60,
  },
]
