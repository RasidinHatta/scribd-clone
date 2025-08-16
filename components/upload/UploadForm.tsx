"use client";

import { useForm } from "react-hook-form";
import CardWrapper from "../auth/CardWrapper";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentSchema } from "@/lib/schemas";
import { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { uploadDocCloudinary } from "@/actions/document";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

/**
 * UploadForm Component
 * 
 * A form for uploading documents to the platform with:
 * - Title input
 * - Subject selection dropdown
 * - Description textarea
 * - File upload functionality
 * - Cloudinary integration for file storage
 * 
 * Features:
 * - Form validation using Zod schema
 * - Loading state during upload
 * - Success/error feedback with toast notifications
 * - File type restriction (PDF, DOC, DOCX)
 */
const UploadForm = () => {
  // State for loading indicator and file handling
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with Zod validation and default values
  const form = useForm<z.infer<typeof DocumentSchema>>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      title: "",
      description: "",
      publicId: "",
      format: "",
      resourceType: "",
      subject: "SECRH", // Default to SECRH
    },
  });

  /**
   * Handles form submission
   * @param data - Validated form data according to DocumentSchema
   */
  const onSubmit = async (data: z.infer<typeof DocumentSchema>) => {
    setLoading(true);

    // Validate file is selected
    if (!file) {
      toast.error("Please select a file.");
      setLoading(false);
      return;
    }

    // Upload document to Cloudinary
    const res = await uploadDocCloudinary(file, data);
    
    // Handle response
    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success(res.success);
      // Reset form and file input on success
      form.reset();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Title Input Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Document's title" 
                      type="text" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Subject Selection Dropdown */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SECRH">SECRH</SelectItem>
                      <SelectItem value="SECVH">SECVH</SelectItem>
                      <SelectItem value="SECBH">SECBH</SelectItem>
                      <SelectItem value="SECPH">SECPH</SelectItem>
                      <SelectItem value="SECJH">SECJH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description Textarea */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief description" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Input */}
            <FormItem>
              <FormLabel>Upload File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx" // Restrict to document formats
                  ref={fileInputRef}
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

          {/* Submit Button with Loading State */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Document"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default UploadForm;