"use client";

import { useForm } from "react-hook-form";
import CardWrapper from "./auth/CardWrapper";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentSchema } from "@/lib/schemas";
import { useState, useRef } from "react"; // ✅ Import useRef
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { uploadDocCloudinary } from "@/actions/document";
import { toast } from "sonner";

const UploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ✅ Create ref

  const form = useForm<z.infer<typeof DocumentSchema>>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      title: "",
      description: "",
      publicId: "",
      format: "",
      resourceType: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof DocumentSchema>) => {
    setLoading(true);

    if (!file) {
      toast.error("Please select a file.");
      setLoading(false);
      return;
    }

    const res = await uploadDocCloudinary(file, data);
    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success(res.success);
      form.reset();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ✅ Clear actual input
      }
    }

    setLoading(false);
  };

  return (
    <CardWrapper
      headerLabel="Document Uploader"
      title="Upload Document"
      backButtonHref="/"
      backButtonLabel="Back to Home Page"
      showSocial={false}
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Document's title" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Brief description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Upload File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef} // ✅ Attach ref
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </FormControl>
              {!file && <FormMessage>Please select a file</FormMessage>}
            </FormItem>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Upload Document"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default UploadForm;