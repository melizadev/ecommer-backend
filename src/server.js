import dotenv from 'dotenv'
import express from 'express'
import { connectDB, disconnectDB } from '../config/config_db.js'
import authRoutes from '../routes/authRoutes.js'
import productRoutes from '../routes/productRoutes.js'
import cartRoutes from '../routes/cartRoutes.js'
import orderRoutes from '../routes/orderRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cookie',
            'Set-Cookie',
        ],
        credentials: true,
    })
)
app.use(cookieParser())
app.use(express.json())
const PORT = process.env.PORT
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })

    .catch(() => {
        disconnectDB()
    })
