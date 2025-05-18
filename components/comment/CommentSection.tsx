"use client";

import React from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import CommentsEmpty from "../empty-states/CommentsEmpty";
import { buildCommentTree } from "@/lib/buildCommentTree";

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

interface CommentSectionProps {
  documentId: string;
  user: User | null;
  comments: CommentType[]; // flat array
}

const CommentSection: React.FC<CommentSectionProps> = ({
  documentId,
  user,
  comments,
}) => {
  const nestedComments = buildCommentTree(comments);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Discussion</h2>
      <CommentForm
        user={user || { name: "Anonymous", image: null }}
        documentId={documentId}
      />
      {nestedComments.length === 0 ? (
        <CommentsEmpty />
      ) : (
        <div className="space-y-6">
          {nestedComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              documentId={documentId}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
