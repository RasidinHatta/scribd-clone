"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipWrapper } from "../wrappers/TooltipWrapper";
import { CldImage } from "next-cloudinary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTransition } from "react";
import { deleteDocumentById, editDocumentById } from "@/actions/document";
import { Badge } from "../ui/badge";

interface PDFCardProps {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  publicId?: string;
  author: string;
  authorImage?: string | null;
  showActions?: boolean;
}

const PDFCard = ({
  id,
  title,
  description,
  subject,
  publicId,
  author,
  authorImage,
  showActions = false,
}: PDFCardProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteDocumentById(id);
      if (res.success) {
        toast.success("Document deleted successfully");
        setDeleteOpen(false);
      } else {
        toast.error(res.error || "Failed to delete document");
      }
    });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await editDocumentById(id, {
        title: editedTitle,
        description: editedDescription
      });
      if (res.success) {
        toast.success("Document updated successfully");
        setEditOpen(false);
      } else {
        toast.error(res.error || "Failed to update document");
      }
    });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="relative">
          <CardTitle className="truncate pr-8">{title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {description || "No description provided."}
          </CardDescription>
          <Badge>{subject}</Badge>

          {showActions && (
            <div className="absolute top-4 right-4 hover:bg-primary rounded-md">
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
                    onSelect={() => {
                      setEditedTitle(title);
                      setEditedDescription(description || "");
                      setEditOpen(true);
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
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 h-48 w-full relative overflow-hidden">
          {publicId && (
            <CldImage
              fill
              src={publicId}
              sizes="100vw"
              alt="Document preview"
              className="object-cover object-top"
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorImage || "https://github.com/shadcn.png"} />
              <AvatarFallback>
                {author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{author}</span>
          </div>

          <TooltipWrapper content="View PDF document">
            <Button asChild size="sm" variant="outline">
              <Link href={`/documents/${id}`}>
                View PDF
              </Link>
            </Button>
          </TooltipWrapper>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{title}"? This action
              cannot be undone and will permanently remove the document.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
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
    </>
  );
};

export default PDFCard;