import * as z from "zod";

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    passwordConfirmation: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"], // show error at confirmation field
});


export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(1, {
        message: "Please enter a valid password",
    }),
    code: z.optional(z.string())
});

export const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    passwordConfirmation: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

export const DocumentSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().optional(),
    url: z.string().url({
        message: "Invalid Cloudinary URL",
    }),
    publicId: z.string().min(1, {
        message: "Public ID is required",
    }),
    format: z.string().optional(),
    resourceType: z.string().optional(),
})
