"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/lib/schemas";
import { z } from "zod";
import { useState } from "react";
import { createComment } from "@/actions/comment";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

type CommentFormProps = {
    user: {
        name?: string | null;
        image?: string | null;
    };
    documentId: string;
    parentId?: string;
    onSuccess?: () => void;
};

const CommentForm = ({ user, documentId, parentId, onSuccess }: CommentFormProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof CommentSchema>>({
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            content: "",
            documentId,
            parentId,
        },
    });

    const onSubmit = async (data: z.infer<typeof CommentSchema>) => {
        setLoading(true);
        const res = await createComment({ ...data, documentId, parentId });
        if (res.success) {
            toast.success(res.success);
            form.reset();
            onSuccess?.();
            router.refresh(); // ✅ refresh the current route
        } else if (res.error) {
            toast.error(res.error);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-3">
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback>
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <Textarea
                        placeholder="Add to the discussion..."
                        {...form.register("content")}
                        className="min-h-[100px]"
                        disabled={loading}
                    />
                    {form.formState.errors.content && (
                        <p className="text-destructive text-sm">
                            {form.formState.errors.content.message}
                        </p>
                    )}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;