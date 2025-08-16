"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormError } from '../FormError'
import { FormSuccess } from '../FormSuccess'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetPasswordSchema } from '@/lib/schemas'
import { useState } from 'react'
import { forgotPassword } from '@/actions/password'
import CardWrapper from '../CardWrapper'

const ForgotPasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
        setLoading(true);
        forgotPassword(data).then((res) => {
            if (res.error) {
                setError(res.error)
                setLoading(false)
            }
            if (res.success) {
                setError("");
                setSuccess(res.success)
                setLoading(false)
            }
        })
    };
    return (
        <CardWrapper
            headerLabel="Reset your password"
            title="Forgot Password"
            backButtonHref="/login"
            backButtonLabel="Cancel"
        >
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Submiting..." : "Submit"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default ForgotPasswordForm