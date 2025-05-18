"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import CommentForm from "./CommentForm";

interface User {
  name?: string | null;
  image?: string | null;
}

interface CommentType {
  id: string;
  content: string;
  user?: User | null;
  replies?: CommentType[];
  createdAt: Date;
  parentId?: string | null;
}

interface CommentProps {
  comment: CommentType;
  documentId: string;
  user?: User | null;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  documentId,
  user,
  depth = 0,
}) => {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className={`space-y-2 p-4 border rounded-md ${depth > 0 ? "ml-8" : ""}`}>
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={comment.user?.image || undefined} />
          <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{comment.user?.name || "Anonymous"}</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {comment.content}
          </p>
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="text-xs text-primary hover:underline mt-1"
          >
            {showReply ? "Cancel" : "Reply"}
          </button>

          {showReply && user && (
            <div className="mt-2">
              <CommentForm
                user={user}
                documentId={documentId}
                parentId={comment.id}
                onSuccess={() => {
                  setShowReply(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              documentId={documentId}
              user={user}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
