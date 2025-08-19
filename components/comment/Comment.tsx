"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CommentType, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { deleteComment } from "@/actions/comment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import ReactMarkdownFormat from "./reactMarkdownFormat";
import { Skeleton } from "../ui/skeleton";

interface CommentProps {
  comment: CommentType;
  documentId: string;
  user?: User | null;
  isReply?: boolean;
  replyChain?: string[];
  onStartReply?: (parentId: string, mainId: string, replyingTo: string) => void;
  isReplying?: boolean;
}

const AVATAR_TIMEOUT_MS = 3000; // safety fallback if avatar never loads

const Comment: React.FC<CommentProps> = ({
  comment,
  documentId,
  user,
  isReply = false,
  replyChain = [],
  onStartReply,
  isReplying = false,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Track avatar loading state
  const [avatarStillLoading, setAvatarStillLoading] = useState<boolean>(
    !!comment.user?.image
  );
  
  const timeoutRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const router = useRouter();

  // Preload avatar when user image changes
  useEffect(() => {
    // cleanup previous
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
      imgRef.current = null;
    }

    if (!comment.user?.image) {
      // no remote image -> show fallback immediately
      setAvatarStillLoading(false);
      return;
    }

    setAvatarStillLoading(true);

    const img = new Image();
    imgRef.current = img;

    const handleLoaded = () => {
      setAvatarStillLoading(false);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleError = () => {
      // image failed to load -> show fallback
      setAvatarStillLoading(false);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    img.onload = handleLoaded;
    img.onerror = handleError;

    // Start loading
    img.src = comment.user.image;

    // Safety fallback: if image hasn't fired load/error in X ms, give up and show fallback
    timeoutRef.current = window.setTimeout(() => {
      setAvatarStillLoading(false);
      timeoutRef.current = null;
    }, AVATAR_TIMEOUT_MS);

    // cleanup on unmount / image change
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
        imgRef.current = null;
      }
    };
  }, [comment.user?.image]);

  const toggleReplies = useCallback(() => {
    setShowReplies((prev) => !prev);
  }, []);

  const handleStartReply = useCallback(() => {
    if (onStartReply) {
      onStartReply(
        comment.id, 
        comment.mainId || comment.id, 
        comment.user?.name || "Anonymous"
      );
    }
  }, [onStartReply, comment.id, comment.mainId, comment.user?.name]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const result = await deleteComment(comment.id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting the comment");
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  }, [comment.id, router]);

  const newReplyChain = comment.parentId
    ? [...replyChain, comment.user?.name || "Anonymous"]
    : [];

  const hasReplies = Array.isArray(comment.replies) && comment.replies.length > 0;
  const isOwner = user?.id === comment.user?.id;

  // Show skeleton while avatar is loading
  const showAvatarSkeleton = avatarStillLoading;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-6" : ""}`}>
      {showAvatarSkeleton ? (
        <Skeleton className="w-8 h-8 mt-1 rounded-full" />
      ) : (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={comment.user?.image || undefined} />
          <AvatarFallback>
            {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1">
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            {showAvatarSkeleton ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {comment.user?.name || "Anonymous"}
                  {isOwner && " (you)"}
                  {isReply && replyChain.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      → {replyChain.join(" → ")}
                    </span>
                  )}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </>
            )}
          </div>
          {!showAvatarSkeleton && <ReactMarkdownFormat comment={comment} />}
        </div>
        
        {!showAvatarSkeleton && (
          <div className="flex gap-3 mt-1">
            {onStartReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartReply}
                className="text-xs text-primary h-6 px-2"
                disabled={isReplying}
              >
                {isReplying ? "Replying..." : "Reply"}
              </Button>
            )}
            {isOwner && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive h-6 px-2 hover:text-destructive"
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Comment</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this comment? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleReplies}
                className="text-xs text-muted-foreground h-6 px-2"
              >
                {showReplies ? "Hide replies" : `Show replies (${comment.replies?.length})`}
              </Button>
            )}
          </div>
        )}
        
        {showReplies && hasReplies && (
          <div className="mt-3 space-y-3">
            {comment.replies?.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                documentId={documentId}
                user={user}
                isReply={true}
                replyChain={newReplyChain}
                onStartReply={onStartReply}
                isReplying={isReplying}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Comment);