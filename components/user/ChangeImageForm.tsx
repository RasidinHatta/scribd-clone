"use client"

import React, { useState } from 'react'
import { Form } from '../ui/form';
import { UserImageSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormError } from '../auth/FormError';
import { FormSuccess } from '../auth/FormSuccess';
import { Button } from '../ui/button';
import { userImageUpload } from '@/actions/image';
import ChangeUserImage from './ChangeUserImage';

const ChangeImageForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const form = useForm<z.infer<typeof UserImageSchema>>({
        resolver: zodResolver(UserImageSchema),
        defaultValues: {
            publicId: "",
            format: "png"
        },
    });

    const onSubmit = async (data: z.infer<typeof UserImageSchema>) => {
        setLoading(true);
        userImageUpload(data).then((res) => {
            if (res.error) {
                setError(res.error);
                setLoading(false);
            }
            if (res.success) {
                setError("");
                setSuccess(res.success);
                setLoading(false);
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ChangeUserImage
                    onUpload={(info) => {
                        form.setValue("publicId", info.public_id);
                        form.setValue("format", info.format);
                    }}
                />
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Updating" : "Update Image"}
                </Button>
            </form>
        </Form>
    )
}

export default ChangeImageForm