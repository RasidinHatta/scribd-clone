"use client";

import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { register } from "@/actions/register"
import { RegisterSchema } from "@/lib/schemas"
import GoogleButton from "../GoogleButton"
import { toast } from "sonner"
import AuthCardWrapper from "../AuthCardWrapper"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Calculates password strength based on complexity criteria
 * @param password - The password to evaluate
 * @returns Object containing strength label, color, and score (0-100)
 */
const getPasswordStrength = (password: string) => {
  let score = 0;
  // Score calculation based on password requirements
  if (password.length >= 8) score += 20;
  if (/[a-z]/.test(password)) score += 20; // Lowercase check
  if (/[A-Z]/.test(password)) score += 20; // Uppercase check
  if (/\d/.test(password)) score += 20; // Number check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20; // Special char check

  // Determine strength label and color based on score
  let label = "Weak";
  let color = "bg-red-500";

  if (score >= 60 && score < 80) {
    label = "Medium";
    color = "bg-yellow-500";
  } else if (score >= 80) {
    label = "Strong";
    color = "bg-green-500";
  }

  return { label, color, score };
};

/**
 * Registration form component with:
 * - Email, name, password, and password confirmation fields
 * - Real-time password strength indicator
 * - Visual feedback for password requirements
 * - Integration with registration API
 */
const RegisterForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Initialize form with Zod validation
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  /**
   * Handles form submission
   * @param data - Form data validated against RegisterSchema
   */
  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    register(data).then((res) => {
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
    <AuthCardWrapper agreement headerLabel="Getting Started" description="Create an account" label="Sign In" href="/login" question="Already have an account? " >
      <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
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

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field with Strength Indicator */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  // Calculate password strength metrics
                  const { label, color, score } = getPasswordStrength(passwordInput);

                  // Password requirement checklist
                  const requirements = [
                    { regex: /^.{8,}$/, label: "8+ characters" },
                    { regex: /[a-z]/, label: "Lowercase letter" },
                    { regex: /[A-Z]/, label: "Uppercase letter" },
                    { regex: /\d/, label: "Number" },
                    { regex: /[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/, label: "Special character" },
                  ];

                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          onChange={(e) => {
                            field.onChange(e);
                            setPasswordInput(e.target.value);
                          }}
                        />
                      </FormControl>

                      {/* Password Strength Visual Feedback */}
                      <div className="mt-2 space-y-2">
                        {passwordInput && (
                          <>
                            {/* Strength Meter Bar */}
                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${score < 40 ? 'bg-destructive' :
                                  score < 70 ? 'bg-warning' : 'bg-success'
                                  }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            {/* Strength Label */}
                            <p className={`text-xs ${score < 40 ? 'text-destructive' :
                              score < 70 ? 'text-warning' : 'text-success'
                              }`}>
                              Strength: {label}
                            </p>
                          </>
                        )}

                        {/* Requirement Checklist */}
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {requirements.map((req, i) => (
                            <div key={i} className="flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${req.regex.test(passwordInput)
                                ? 'bg-primary'
                                : 'bg-muted-foreground/20'
                                }`} />
                              <span className={req.regex.test(passwordInput)
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

              {/* Password Confirmation Field */}
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="******" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full text-background" disabled={loading}>
              {loading ? "Registering..." : "Register"}
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
  );
};

export default RegisterForm;