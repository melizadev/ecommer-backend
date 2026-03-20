import z from 'zod'
//validation schema for user registration
export const registerSchema = z.object({
    username: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z0-9._-]+$/, 'Username must contain only letters'),
    email: z.string().email().min(6).max(254),
    password: z.string().min(6).max(254),
})

export const loginSchema = z.object({
    email: z.string().email().min(6).max(254),
    password: z.string().min(6).max(254),
})
