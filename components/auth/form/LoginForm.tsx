"use client"

import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { login } from "@/actions/login"
import { LoginSchema } from "@/lib/schemas"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import GoogleButton from "../GoogleButton"
import Link from "next/link"
import AuthCardWrapper from "../AuthCardWrapper"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "", // ✅ ensure it's always registered
        },
    })

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {

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
        <AuthCardWrapper agreement headerLabel="Welcome back" description="Login to your Study Archive account" label="Sign Up" href="/register" question="Don't have an account? " >
            <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {!showTwoFactor && (
                            <>
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" placeholder="you@example.com" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" placeholder="******" disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two-Factor Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="123456" disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Submit */}
                        <Button type="submit" className="w-full text-secondary" disabled={isPending}>
                            {showTwoFactor
                                ? (isPending ? "Confirming..." : "Confirm")
                                : (isPending ? "Logging In..." : "Login")
                            }
                        </Button>
                    </form>
                </Form>

                <div className="mt-4 text-end text-sm">
                    <Link href="/forgot-password" className="hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <div className="mt-6 space-y-6">
                    {/* Divider */}
                    <div className="relative text-center text-sm">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <span className="bg-card relative z-10 px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>

                    {/* Google Button */}
                    <GoogleButton />
                </div>
            </div>
        </AuthCardWrapper>
    )
}