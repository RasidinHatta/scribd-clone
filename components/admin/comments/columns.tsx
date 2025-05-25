"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Comment, User, Document } from "@/lib/generated/prisma/client"
import { CommentActionCell } from "./action-cell"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type CommentWithRelations = Comment & {
  user: Pick<User, 'id' | 'name' | 'email'>;
  document: Pick<Document, 'id' | 'title'>;
  parent?: Pick<Comment, 'id' | 'content'> | null;
  replies?: Pick<Comment, 'id' | 'content' | 'createdAt' | 'userId'>[];
};

export const commentColumns: ColumnDef<CommentWithRelations>[] = [
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content = row.original.content
      const isReply = !!row.original.parentId
      const maxLength = 30 // Character limit before truncation
      const displayText = content.length > maxLength
        ? `${content.substring(0, maxLength)}...`
        : content

      return (
        <div className={isReply ? "pl-6 border-l-2 border-muted-foreground/30" : ""}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-foreground cursor-default">
                {displayText}
              </p>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-[300px]">
              <p className="break-words">{content}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
  {
    accessorKey: "user",
    header: "Author",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex flex-col">
          <span className="text-foreground">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => {
      const document = row.original.document
      return (
        <p className="text-foreground hover:text-primary transition-colors cursor-pointer">
          {document.title}
        </p>
      )
    },
  },
  {
    accessorKey: "parent",
    header: "In Reply To",
    cell: ({ row }) => {
      const parent = row.original.parent;
      const maxLength = 30; // Character limit before truncation

      if (!parent) return <span className="text-muted-foreground">—</span>;

      const displayText = parent.content.length > maxLength
        ? `${parent.content.substring(0, maxLength)}...`
        : parent.content;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-muted-foreground cursor-default">
              {displayText}
            </p>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" className="max-w-[300px]">
            <p className="break-words">{parent.content}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:text-primary"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </p>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-foreground hover:text-primary"
      >
        Last Edited
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-muted-foreground">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </p>
      )
    },
    enableSorting: true,
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
          hasReplies={!!comment.replies} // Assuming you have replies count
          documentTitle={comment.document?.title} // Pass the document title if available
        />
      )
    },
  }
]