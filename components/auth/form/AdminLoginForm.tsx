"use client"

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/schemas';
import { adminLogin } from '@/actions/login';
import CardWrapper from '../CardWrapper';
import { toast } from 'sonner';
import AuthCardWrapper from '../AuthCardWrapper';
import { cn } from '@/lib/utils';

const AdminLoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setLoading(true);
        adminLogin(data).then((res) => {
            if (res.error) {
                toast.error(res.error, {
                    duration: 5000
                });
                setLoading(false);
            }
            if (res.success) {
                toast.success(res.success, {
                    duration: 3000
                });
                setLoading(false);
            }
        });
    };

    return (
        <AuthCardWrapper admin agreement headerLabel="Welcome back, Admin" description="Login to your Study Archive account">
            <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="johndoe@email.com"
                                                type="email"
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full text-background" disabled={loading}>
                            {loading ? "Logging In..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCardWrapper>
    );
}

export default AdminLoginForm;