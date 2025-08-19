"use client";

import React, { useState, useCallback } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import CommentsEmpty from "../empty-states/CommentsEmpty";
import { buildCommentTree } from "@/lib/buildCommentTree";
import { CommentType, User } from "@/types";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface CommentSectionProps {
  documentId: string;
  user: User | null;
  comments: CommentType[];
}

interface ReplyState {
  parentId: string;
  mainId: string;
  replyingTo: string; // Name of the user being replied to
}

const CommentSection: React.FC<CommentSectionProps> = ({
  documentId,
  user,
  comments,
}) => {
  const [replyState, setReplyState] = useState<ReplyState | null>(null);
  const nestedComments = buildCommentTree(comments);

  const handleStartReply = useCallback((parentId: string, mainId: string, replyingTo: string) => {
    setReplyState({ parentId, mainId, replyingTo });
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyState(null);
  }, []);

  const handleSuccess = useCallback(() => {
    setReplyState(null);
  }, []);

  return (
    <Card className="w-full mx-auto mt-10 hover:shadow-lg transition-shadow">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
          {nestedComments.length === 0 ? (
            <CommentsEmpty />
          ) : (
            <div className="space-y-4">
              {nestedComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  documentId={documentId}
                  user={user}
                  isReply={false}
                  onStartReply={handleStartReply}
                  isReplying={replyState?.parentId === comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t px-6 py-4 bg-muted/20">
        {replyState ? (
          <div className="w-full mb-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-muted-foreground">
                Replying to <span className="font-medium">{replyState.replyingTo}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelReply}
                className="text-xs h-7 px-2"
              >
                Cancel
              </Button>
            </div>
            <CommentForm
              user={user || { name: "Anonymous", image: null }}
              documentId={documentId}
              parentId={replyState.parentId}
              mainId={replyState.mainId}
              onSuccess={handleSuccess}
              onCancel={handleCancelReply}
            />
          </div>
        ) : (
          <div className="w-full">
            <CommentForm
              user={user || { name: "Anonymous", image: null }}
              documentId={documentId}
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CommentSection;