/**
 * Source: /components/admin/comments/columns.tsx
 *
 * This file defines the column configuration for the admin comments table.
 * It includes sorting, formatting, and custom cell rendering for comment data.
 * The CommentActionCell component provides row-level actions (view, edit, delete, replies, document/user details).
 */

"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Comment, User, Document } from "@/lib/generated/prisma/client"
import { CommentActionCell } from "./action-cell"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export type CommentWithRelations = Comment & {
  user: Pick<User, 'id' | 'name' | 'email'>
  document: Pick<Document, 'id' | 'title'>
  parent?: Pick<Comment, 'id' | 'content'> | null
  replies?: Array<Pick<Comment, 'id' | 'content' | 'createdAt' | 'userId'>>
  _count?: {
    replies?: number
  }
  // Explicit count property as alternative
  repliesCount?: number
}

export const commentColumns: ColumnDef<CommentWithRelations>[] = [
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const { content, parentId } = row.original
      const maxLength = 50
      const truncated = content.length > maxLength
        ? `${content.substring(0, maxLength)}...`
        : content

      return (
        <div className={parentId ? "pl-6 border-l-2 border-muted-foreground/30" : ""}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="line-clamp-2 text-sm">
                {truncated}
              </span>
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
    header: "Author",
    cell: ({ row }) => {
      const { name, email } = row.original.user
      return (
        <div className="space-y-1">
          <p className="font-medium text-sm">{name || "Anonymous"}</p>
          <p className="text-muted-foreground text-xs">{email}</p>
        </div>
      )
    },
    size: 200,
  },
  {
    accessorKey: "document.title",
    header: "Document",
    cell: ({ row }) => {
      const title = row.original.document.title
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
      if (!parent) return <span className="text-muted-foreground text-sm">—</span>

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-xs font-normal max-w-[120px] truncate">
              {parent.content.substring(0, 20)}{parent.content.length > 20 ? "..." : ""}
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
      // First check for direct replies array
      const directRepliesCount = row.original.replies?.length || 0;

      // Then check for _count.replies (Prisma count)
      const prismaRepliesCount = row.original._count?.replies || 0;

      // Use whichever is available
      const replyCount = Math.max(directRepliesCount, prismaRepliesCount);

      return replyCount > 0 ? (
        <Badge variant="secondary" className="text-xs">
          {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">None</span>
      );
    },
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString()}
      </div>
    ),
    sortingFn: 'datetime',
    size: 160,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt)
      const updatedAt = new Date(row.original.updatedAt)
      const wasEdited = updatedAt.getTime() > createdAt.getTime() + 1000 // 1 second buffer

      return wasEdited ? (
        <div className="text-xs text-muted-foreground">
          {updatedAt.toLocaleString()}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground/50">Not edited</div>
      )
    },
    sortingFn: 'datetime',
    size: 160,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const comment = row.original
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