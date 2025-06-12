"use client";

import { useState, useRef } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/lib/schemas";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createComment } from "@/actions/comment";
import { Button } from "../ui/button";

type CommentFormProps = {
  user: {
    name?: string | null;
    image?: string | null;
  };
  documentId: string;
  parentId?: string;
  mainId?: string;
  onSuccess?: () => void;
};

const CommentForm = ({
  user,
  documentId,
  parentId,
  mainId,
  onSuccess,
}: CommentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      documentId,
      parentId,
      mainId: parentId ? mainId : undefined,
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await createComment({
        content: form.watch("content"),
        documentId,
        parentId,
        mainId: parentId ? mainId : undefined
      });

      if (res.success) {
        toast.success(res.success);
        form.reset();
        setCharCount(0);
        onSuccess?.();
        router.refresh();
      } else if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-3">
      <Avatar className="w-10 h-10 rounded-full">
        <AvatarImage src={user?.image || ""} />
        <AvatarFallback className="rounded-full">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col gap-2">
        <div className="relative" ref={editorRef}>
          <MDEditor
            value={form.watch("content")}
            onChange={(val: string | undefined) => {
              form.setValue("content", val || "");
              setCharCount(val?.length || 0);
            }}
            height={150}
            preview="edit"
            textareaProps={{
              placeholder: "Add a comment...",
            }}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.divider,
              commands.link,
              commands.divider,
              commands.code,
              commands.codeBlock,
              commands.divider,
              commands.orderedListCommand,
              commands.unorderedListCommand,
              commands.checkedListCommand,
              commands.divider,
              commands.quote,
              commands.table,
              commands.title
            ]}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {charCount}/1000 characters
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={loading || !form.watch("content").trim()}
            className="rounded-md px-4 h-10"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;