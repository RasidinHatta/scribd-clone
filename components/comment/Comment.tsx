"use client";

import React, { useState, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import CommentForm from "./CommentForm";
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
import ReactMarkdown from "react-markdown";
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface CommentProps {
  comment: CommentType;
  documentId: string;
  user?: User | null;
  isReply?: boolean;
  replyChain?: string[];
}

const Comment: React.FC<CommentProps> = ({
  comment,
  documentId,
  user,
  isReply = false,
  replyChain = [],
}) => {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const toggleReply = useCallback(() => {
    setShowReply((prev) => !prev);
  }, []);

  const toggleReplies = useCallback(() => {
    setShowReplies((prev) => !prev);
  }, []);

  const handleSuccess = useCallback(() => {
    setShowReply(false);
    router.refresh();
  }, [router]);

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

  return (
    <div className={`flex gap-3 ${isReply ? "ml-6 mt-3" : ""}`}>
      <Avatar className="w-8 h-8 mt-1">
        <AvatarImage src={comment.user?.image || undefined} />
        <AvatarFallback>
          {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
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
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, className, children, ...props }) {
                  const isInline = (props as any).inline;
                  const match = /language-(\w+)/.exec(className || "");
                  return !isInline && match ? (
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
                  );
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
                  );
                },
                blockquote({ node, children, ...props }) {
                  return (
                    <blockquote className="border-l-4 border-muted-foreground pl-3 italic my-2">
                      {children}
                    </blockquote>
                  );
                },
                ul({ node, children, ...props }) {
                  return (
                    <ul className="list-disc pl-5 my-2" {...props}>
                      {children}
                    </ul>
                  );
                },
                ol({ node, children, ...props }) {
                  return (
                    <ol className="list-decimal pl-5 my-2" {...props}>
                      {children}
                    </ol>
                  );
                },
                h1({ node, children, ...props }) {
                  return (
                    <h1 className="text-xl font-bold my-2" {...props}>
                      {children}
                    </h1>
                  );
                },
                h2({ node, children, ...props }) {
                  return (
                    <h2 className="text-lg font-bold my-2" {...props}>
                      {children}
                    </h2>
                  );
                },
                h3({ node, children, ...props }) {
                  return (
                    <h3 className="text-base font-bold my-2" {...props}>
                      {children}
                    </h3>
                  );
                },
                strong({ node, children, ...props }) {
                  return (
                    <strong className="font-semibold" {...props}>
                      {children}
                    </strong>
                  );
                },
                em({ node, children, ...props }) {
                  return (
                    <em className="italic" {...props}>
                      {children}
                    </em>
                  );
                },
              }}
            >
              {comment.content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex gap-3 mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleReply}
            className="text-xs text-primary h-6 px-2"
            aria-expanded={showReply}
          >
            {showReply ? "Cancel" : "Reply"}
          </Button>
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
        {showReply && user && (
          <div className="mt-3">
            <CommentForm
              user={user}
              documentId={documentId}
              parentId={comment.id}
              mainId={comment.mainId || comment.id}
              onSuccess={handleSuccess}
            />
          </div>
        )}
        {showReplies && hasReplies && (
          <div className="space-y-3">
            {comment.replies?.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                documentId={documentId}
                user={user}
                isReply={true}
                replyChain={newReplyChain}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Comment);