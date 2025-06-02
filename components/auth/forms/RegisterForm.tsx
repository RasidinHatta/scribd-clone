"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { register } from "@/actions/register";
import { RegisterSchema } from "@/lib/schemas";
import CardWrapper from "../CardWrapper";
import GoogleButton from "../GoogleButton";
import { toast } from "sonner";

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

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

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
    },
  });

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
    <CardWrapper
      headerLabel="Create an account"
      title="Register"
      backButtonHref="/login"
      backButtonLabel="Already have an account"
      showSocial
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const { label, color, score } = getPasswordStrength(passwordInput);
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

                    <div className="mt-2 space-y-2">
                      {passwordInput && (
                        <>
                          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${score < 40 ? 'bg-destructive' :
                                  score < 70 ? 'bg-warning' : 'bg-success'
                                }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <p className={`text-xs ${score < 40 ? 'text-destructive' :
                              score < 70 ? 'text-warning' : 'text-success'
                            }`}>
                            Strength: {label}
                          </p>
                        </>
                      )}

                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {requirements.map((req, i) => (
                          <div key={i} className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${req.regex.test(passwordInput)
                                ? 'bg-success'
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
      </Form>
      <GoogleButton />
    </CardWrapper>
  );
};

export default RegisterForm;