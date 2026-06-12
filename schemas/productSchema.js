import { z } from 'zod'

export const productSchema = z.object({
    title: z.string().min(3).max(30),
    category: z.string().min(3).max(30),
    stock: z.coerce.number().min(0),
    price: z.coerce.number().min(0),
    imageUrl: z.string().min(3),
})
