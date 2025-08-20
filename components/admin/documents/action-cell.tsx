"use client"

import { deleteDocumentById, editDocumentById, getDocumentById, getDocumentComments } from "@/actions/admin/document"
import { Button } from "@/components/ui/button"
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
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

export type DocumentDetails = {
  id: string
  title: string
  description: string | null
  url: string
  publicId: string
  format: string | null
  resourceType: string | null
  userId: string
  user: {
    name: string | null
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

type Comment = {
  id: string
  content: string
  userId: string
  documentId: string
  createdAt: Date
  updatedAt: Date | string
  parentId: string | null
  user: User
}

interface User {
  id: string;
  name: string | null;
}

interface DocumentActionCellProps {
  documentId: string
  documentTitle: string
}

function DocumentActionCell({ documentId, documentTitle }: DocumentActionCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(documentTitle)
  const [description, setDescription] = useState("")

  const loadDocumentDetails = () => {
    startTransition(async () => {
      const res = await getDocumentById(documentId)
      if (res.success && res.data) {
        setDocumentDetails({
          ...res.data,
          createdAt: new Date(res.data.createdAt),
          updatedAt: new Date(res.data.updatedAt),
          user: res.data.user
        })
        setViewOpen(true)
      } else {
        toast.error(res.error || "Failed to load document details")
      }
    })
  }

  const loadDocumentComments = () => {
    startTransition(async () => {
      const res = await getDocumentComments(documentId)
      if (res.success && res.data) {
        setComments(res.data.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt),
          user: comment.user
        })))
        setCommentsOpen(true)
      } else {
        toast.error(res.error || "Failed to load comments")
      }
    })
  }

  const onConfirmDelete = () => {
    startTransition(async () => {
      const res = await deleteDocumentById(documentId)
      if (res.success) {
        toast.success("Document deleted successfully")
        setDeleteOpen(false)
      } else {
        toast.error(res.error || "Failed to delete document")
      }
    })
  }

  const onConfirmEdit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await editDocumentById(documentId, { title, description })
      if (res.success) {
        toast.success("Document updated successfully")
        setEditOpen(false)
      } else {
        toast.error(res.error || "Failed to update document")
      }
    })
  }

  const formatDate = (date: Date) => date.toLocaleString()

  return (
    <div className="rounded-md hover:bg-primary">
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
            onSelect={loadDocumentDetails}
            disabled={isPending}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={loadDocumentComments}
            disabled={isPending}
          >
            View Comments
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setTitle(documentTitle)
              setDescription(documentDetails?.description || "")
              setEditOpen(true)
            }}
            disabled={isPending}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={() => setDeleteOpen(true)}
            disabled={isPending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Complete information for {documentTitle}
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

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              Comments for {documentTitle}
            </DialogDescription>
          </DialogHeader>
          {comments.length > 0 ? (
            <div className="space-y-4 py-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded border p-4">
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    By: {comment.user.name || 'Anonymous'} • {formatDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              {isPending ? 'Loading...' : 'No comments yet'}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentTitle}"? This action
              cannot be undone and will permanently remove the document.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onConfirmEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document description"
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
    </div>
  )
}

export default DocumentActionCell