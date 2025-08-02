import * as z from "zod";

/**
 * User registration schema with strict password requirements:
 * - Email validation
 * - Name required
 * - Password must be 8+ chars with uppercase, lowercase, number, and special char
 * - Password confirmation must match
 */
export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
            {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            }
        ),
    passwordConfirmation: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});

/**
 * User login schema:
 * - Email validation
 * - Password required (no complexity requirements)
 * - Optional 2FA code field
 */
export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(1, {
        message: "Please enter a valid password",
    }),
    code: z.optional(z.string())
});

/**
 * Password reset request schema:
 * - Only requires valid email
 */
export const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
});

/**
 * New password setup schema:
 * - Password must be 6+ characters
 * - Password confirmation must match
 */
export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    passwordConfirmation: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

/**
 * Document creation/editing schema:
 * - Title required
 * - Optional description and file metadata fields
 * - Subject must be one of the specified enum values
 */
export const DocumentSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().optional(),
    publicId: z.string().optional(),
    format: z.string().optional(),
    resourceType: z.string().optional(),
    subject: z.enum(["SECRH", "SECVH", "SECBH", "SECPH", "SECJH"]),
});

/**
 * User image upload schema:
 * - Requires publicId from storage service
 * - Requires file format
 */
export const UserImageSchema = z.object({
    publicId: z.string().min(1, {
        message: "Public ID is required",
    }),
    format: z.string()
});

/**
 * Comment creation schema:
 * - Content cannot be empty
 * - Document ID required
 * - Optional parent ID for replies
 * - Optional main ID for thread tracking
 */
export const CommentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty"),
    documentId: z.string(),
    parentId: z.string().optional(),
    mainId: z.string().optional(),
});

/**
 * User profile update schema:
 * - Name and email required
 * - Two-factor auth toggle
 * - Conditional password validation:
 *   - If any password field is filled, all must be valid
 *   - New passwords must match
 */
export const ProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    twoFactorEnabled: z.boolean(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
}).refine(data => {
    // Only validate passwords if any password field is filled
    if (data.newPassword || data.currentPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
    }
    return true;
}, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
});