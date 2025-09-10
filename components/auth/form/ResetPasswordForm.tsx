"use client";

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormError } from "../FormError"
import { FormSuccess } from "../FormSuccess"
import { NewPasswordSchema } from "@/lib/schemas"
import { resetPassword } from "@/actions/password"
import AuthCardWrapper from "../AuthCardWrapper"
import { cn } from "@/lib/utils"

const ResetPasswordForm = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [token, setToken] = useState<string | null>(null); // New state for token

    const searchParams = useSearchParams();

    useEffect(() => {
        setToken(searchParams.get("token"));
    }, [searchParams]);

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        },
    });

    const onSubmit = useCallback((formData: z.infer<typeof NewPasswordSchema>) => {
        if (success) {
            return;
        }

        if (!token) {
            setError("No token provided");
            form.reset();
            return;
        }

        setLoading(true);
        setError("");

        resetPassword({ ...formData, token })
            .then((data) => {
                if (data.success) {
                    setSuccess(data.success);
                    setError("");
                } else if (data.error) {
                    setError(data.error);
                    form.reset();
                }
            })
            .catch((error) => {
                console.error(error);
                setError("An unexpected error occurred");
                form.reset();
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, success, form]);

    // Optional: Show loading state while token is being retrieved
    if (token === null) {
        return (
            <AuthCardWrapper agreement headerLabel="Reset Password" description="Choose a new password" label="Sign In" href="/login" question="Back to login? " >
                <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
                    <div className="flex justify-center items-center p-6">
                        Loading token...
                    </div>
                </div>
            </AuthCardWrapper>
        );
    }

    return (
        <AuthCardWrapper agreement headerLabel="Reset Password" description="Choose a new password" label="Sign In" href="/login" question="Back to login?" >
            <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => {
                                    const requirements = [
                                        { regex: /^.{8,}$/, label: "8+ characters" },
                                        { regex: /[a-z]/, label: "Lowercase letter" },
                                        { regex: /[A-Z]/, label: "Uppercase letter" },
                                        { regex: /\d/, label: "Number" },
                                        { regex: /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/, label: "Special character" },
                                    ];

                                    const metCount = requirements.filter(req => req.regex.test(field.value)).length;
                                    const strength = (metCount / requirements.length) * 100;

                                    return (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="********" type="password" />
                                            </FormControl>
                                            <div className="mt-2">
                                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full transition-all duration-300"
                                                        style={{
                                                            width: `${strength}%`,
                                                            backgroundColor: `hsl(var(--${strength < 40 ? 'destructive' :
                                                                strength < 70 ? 'warning' : 'success'
                                                                }))`
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                                                    {requirements.map((req, i) => (
                                                        <div key={i} className="flex items-center">
                                                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${req.regex.test(field.value)
                                                                ? 'bg-success'
                                                                : 'bg-muted-foreground/20'
                                                                }`} />
                                                            <span className={req.regex.test(field.value)
                                                                ? 'text-foreground'
                                                                : 'text-muted-foreground'
                                                            }>
                                                                {req.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="********" type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        <Button type="submit" className="w-full text-background" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCardWrapper>
    );
};

export default ResetPasswordForm;