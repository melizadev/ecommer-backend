import z from 'zod'

export const productSchema = z.object({
    title: z.string().min(3).max(30),
    slug: z.string().min(3).max(30),
    category: z.string().min(3).max(30),
    price: z.number().min(0).max(0),
    stock: z.number().min(0).max(0),
    imagenUrl: z.string().min(3).max(30),
})
