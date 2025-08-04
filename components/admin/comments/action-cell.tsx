/**
 * Source: /components/admin/comments/action-cell.tsx
 *
 * This component renders action controls for a comment row in the admin panel.
 * It provides dropdown actions to view, edit, or delete a comment, view replies, and show related document/user details.
 * Dialogs are used for viewing comment details, confirming deletion, editing comment content, and displaying replies, document, and user info.
 * Comment, document, user, and reply data are fetched and updated via server actions.
 */

"use client"

import { deleteCommentById, editCommentById, getCommentById, getDocumentByCommentId, getRepliesByCommentId, getUserById } from "@/actions/admin/comment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface CommentActionCellProps {
  commentId: string
  content: string
  isReply: boolean
  userId: string
  hasReplies?: boolean
  documentTitle?: string
}

interface Reply {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    email: string
  }
}

export function CommentActionCell({
  commentId,
  content,
  isReply,
  userId,
  hasReplies = false,
  documentTitle = "this document",
}: CommentActionCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [commentDetailsOpen, setCommentDetailsOpen] = useState(false)
  const [documentDetailsOpen, setDocumentDetailsOpen] = useState(false)
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [editedContent, setEditedContent] = useState(content)
  const [commentDetails, setCommentDetails] = useState<any>(null)
  const [documentDetails, setDocumentDetails] = useState<any>(null)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [repliesOpen, setRepliesOpen] = useState(false)

  const loadCommentDetails = () => {
    startTransition(async () => {
      const res = await getCommentById(commentId)
      if (res.success) {
        setCommentDetails(res.data)
        setCommentDetailsOpen(true)
      } else {
        toast.error(res.error || "Failed to load comment details")
      }
    })
  }

  const loadDocumentDetails = () => {
    startTransition(async () => {
      const res = await getDocumentByCommentId(commentId)
      if (res.success) {
        setDocumentDetails(res.data)
        setDocumentDetailsOpen(true)
      } else {
        toast.error(res.error || "Failed to load document details")
      }
    })
  }

  const loadUserDetails = () => {
    startTransition(async () => {
      const res = await getUserById(userId)
      if (res.success) {
        setUserDetails(res.data)
        setUserDetailsOpen(true)
      } else {
        toast.error(res.error || "Failed to load user details")
      }
    })
  }

  const loadReplies = () => {
    setLoadingReplies(true)
    startTransition(async () => {
      const res = await getRepliesByCommentId(commentId)
      if (res.success && res.data) {
        setReplies(res.data)
        setRepliesOpen(true)
      } else {
        toast.error(res.error || "Failed to load replies")
      }
      setLoadingReplies(false)
    })
  }

  const onConfirmDelete = () => {
    startTransition(async () => {
      const res = await deleteCommentById(commentId)
      if (res.success) {
        toast.success("Comment deleted successfully")
        setDeleteOpen(false)
      } else {
        toast.error(res.error || "Failed to delete Comment")
      }
    })
  }

  const onConfirmEdit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await editCommentById(commentId, { content: editedContent }) // ✅ use updated value
      if (res.success) {
        toast.success("Comment updated successfully")
        setEditOpen(false)
      } else {
        toast.error(res.error || "Failed to update Comment")
      }
    })
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Show Replies option */}
          {hasReplies && (
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={loadReplies}
              disabled={loadingReplies}
            >
              {loadingReplies ? "Loading..." : "Show Replies"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={loadCommentDetails}
            disabled={isPending}
          >
            Comment Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={loadDocumentDetails}
            disabled={isPending}
          >
            Document Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={loadUserDetails}
            disabled={isPending}
          >
            User Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setEditedContent(content)
              setEditOpen(true)
            }}
            disabled={isPending}
          >
            Edit Comment
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={() => setDeleteOpen(true)}
            disabled={isPending}
          >
            Delete Comment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Comment Details Dialog */}
      <Dialog open={repliesOpen} onOpenChange={setRepliesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Replies</DialogTitle>
            <DialogDescription>
              Replies to this comment on {documentTitle}
            </DialogDescription>
          </DialogHeader>
          {replies.length > 0 ? (
            <div className="space-y-4 py-4">
              {replies.map((reply) => (
                <div key={reply.id} className="rounded border p-4">
                  <p className="text-sm">{reply.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    By: {reply.user?.name || 'Anonymous'} • {formatDate(reply.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              {loadingReplies ? 'Loading...' : 'No replies yet'}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Comment Details Dialog */}
      <Dialog open={commentDetailsOpen} onOpenChange={setCommentDetailsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Comment Details</DialogTitle>
            <DialogDescription>
              Detailed information about this comment
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Comment Content */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-1">Content</Label>
              <div className="col-span-3 text-sm prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "")
                      return match ? (
                        <SyntaxHighlighter
                          language={match[1]}
                          // @ts-ignore
                          style={oneDark}
                          customStyle={{ backgroundColor: "transparent" }}
                          PreTag="div"
                          className="rounded-md text-sm my-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      )
                    },
                    a({ node, href, children, ...props }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          {...props}
                        >
                          {children}
                        </a>
                      )
                    },
                    blockquote({ node, children, ...props }) {
                      return (
                        <blockquote className="border-l-4 border-muted-foreground pl-3 italic my-2">
                          {children}
                        </blockquote>
                      )
                    },
                    ul({ node, children, ...props }) {
                      return <ul className="list-disc pl-5 my-2">{children}</ul>
                    },
                    ol({ node, children, ...props }) {
                      return <ol className="list-decimal pl-5 my-2">{children}</ol>
                    },
                    h1({ node, children, ...props }) {
                      return <h1 className="text-xl font-bold my-2">{children}</h1>
                    },
                    h2({ node, children, ...props }) {
                      return <h2 className="text-lg font-bold my-2">{children}</h2>
                    },
                    h3({ node, children, ...props }) {
                      return <h3 className="text-base font-bold my-2">{children}</h3>
                    },
                    table({ node, children, ...props }) {
                      return (
                        <div className="overflow-x-auto my-2">
                          <table
                            className="w-full border-collapse border border-muted-foreground/20"
                            {...props}
                          >
                            {children}
                          </table>
                        </div>
                      )
                    },
                    thead({ node, children, ...props }) {
                      return <thead className="bg-muted/50">{children}</thead>
                    },
                    tbody({ node, children, ...props }) {
                      return <tbody>{children}</tbody>
                    },
                    tr({ node, children, ...props }) {
                      return (
                        <tr className="border-b border-muted-foreground/20">
                          {children}
                        </tr>
                      )
                    },
                    th({ node, children, ...props }) {
                      return (
                        <th className="p-2 text-left font-semibold border-r border-muted-foreground/20 last:border-r-0">
                          {children}
                        </th>
                      )
                    },
                    td({ node, children, ...props }) {
                      return (
                        <td className="p-2 border-r border-muted-foreground/20 last:border-r-0">
                          {children}
                        </td>
                      )
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Comment Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <p className="col-span-3 text-sm text-muted-foreground">
                {isReply ? "Reply" : "Comment"}
              </p>
            </div>

            {/* User Information */}
            {commentDetails?.user && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Author</Label>
                  <p className="col-span-3 text-sm text-muted-foreground">
                    {commentDetails.user.name || "Unknown"}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Email</Label>
                  <p className="col-span-3 text-sm text-muted-foreground">
                    {commentDetails.user.email}
                  </p>
                </div>
              </>
            )}

            {/* Document Information */}
            {commentDetails?.document && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Document</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {commentDetails.document.title}
                </p>
              </div>
            )}

            {/* Timestamps */}
            {commentDetails && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Created At</Label>
                  <p className="col-span-3 text-sm text-muted-foreground">
                    {formatDate(commentDetails.createdAt)}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Updated At</Label>
                  <p className="col-span-3 text-sm text-muted-foreground">
                    {formatDate(commentDetails.updatedAt)}
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Details Dialog */}
      <Dialog open={documentDetailsOpen} onOpenChange={setDocumentDetailsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Information about the document this comment belongs to
            </DialogDescription>
          </DialogHeader>
          {documentDetails ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Title</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {documentDetails.title}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Public ID</Label>
                <p className="col-span-3 text-sm text-muted-foreground break-all">
                  {documentDetails.publicId}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Owner</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {documentDetails.userName} ({documentDetails.userEmail})
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              {isPending ? 'Loading...' : 'No document details available'}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Information about the user who made this comment
            </DialogDescription>
          </DialogHeader>
          {userDetails ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {userDetails.name || 'Not provided'}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <p className="col-span-3 text-sm text-muted-foreground">
                  {userDetails.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              {isPending ? 'Loading...' : 'No user details available'}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {isReply ? "reply" : "comment"}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={onConfirmDelete}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Comment Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Update the comment content below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onConfirmEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Comment</Label>
              <Input
                id="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                required
                minLength={2}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}