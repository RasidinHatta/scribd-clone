"use client"

import React, { useState, useTransition } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/schemas';
import { login } from '@/actions/login';
import CardWrapper from '../CardWrapper';
import GoogleButton from '../GoogleButton';
import Link from 'next/link';
import { toast } from 'sonner';

/**
 * LoginForm component handles user authentication with email/password
 * Supports two-factor authentication flow when enabled
 */
const LoginForm = () => {
    // State management for loading, errors, success, and 2FA
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("")
    const [showTwoFactor, setShowTwoFactor] = useState(false)

    // Form initialization with Zod schema validation
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        },
    });

    /**
     * Handles form submission
     * @param data - Form data validated against LoginSchema
     */
    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        // Wrap in transition to handle loading state
        startTransition(() => {
            login(data).then((res) => {
                if (res.error) {
                    toast.error(res.error, {
                        duration: 5000
                    });
                }
                if (res.success) {
                    form.reset(); // Only reset on full success
                    toast.success(res.success, {
                        duration: 3000
                    });
                }
                if (res.twoFactor) {
                    setShowTwoFactor(true); // Show 2FA input if required
                }
            });
        });
    };

    return (
        <CardWrapper
            headerLabel="Welcome Back"
            title="Login"
            backButtonHref="/register"
            backButtonLabel="Dont have an account?"
            showSocial
        >
            {/* Main form container */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Conditional rendering for 2FA code input */}
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="123456"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Regular email/password fields when not in 2FA mode */}
                        {!showTwoFactor && (
                            <>
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
                                                    disabled={isPending}
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
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>

                    {/* Submit button with dynamic text based on state */}
                    <Button 
                        type="submit" 
                        className="w-full text-secondary" 
                        disabled={isPending}
                    >
                        {showTwoFactor
                            ? (isPending ? "Confirm..." : "Confirm")
                            : (isPending ? "Loading..." : "Login")
                        }
                    </Button>
                </form>
            </Form>

            {/* Additional links and social login */}
            <div className="mt-4 text-center">
                <Link href="/forgot-password" className="hover:underline">
                    Forgot Password?
                </Link>
            </div>
            <GoogleButton />
        </CardWrapper>
    );
}

export default LoginForm