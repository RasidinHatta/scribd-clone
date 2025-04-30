"use client"

import React, { useState, useTransition } from 'react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '../FormError';
import { FormSuccess } from '../FormSuccess';
import { useForm } from 'react-hook-form';
import { z } from "zod"

import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/schemas';
import { login } from '@/actions/login';
import CardWrapper from '../CardWrapper';
import GoogleButton from '../GoogleButton';
import Link from 'next/link';

const LoginForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("")
    const [showTwoFactor, setShowTwoFactor] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        },        
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            login(data).then((res) => {
                if (res.error) {
                    form.reset()
                    setError(res.error)
                }
                if (res.success) {
                    form.reset()
                    setSuccess(res.success)
                }
                if (res.twoFactor) {
                    setShowTwoFactor(true)
                }
            }).catch(() => setError("Something went wrong"));
        })
    };
    return (
        <CardWrapper
            headerLabel="Welcome Back"
            title="Login"
            backButtonHref="/register"
            backButtonLabel="Dont have an account?"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
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
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {showTwoFactor
                            ? (isPending ? "Confirm..." : "Confirm")
                            : (isPending ? "Loading..." : "Login")
                        }
                    </Button>
                </form>
            </Form>
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