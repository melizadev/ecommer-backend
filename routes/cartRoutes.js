import express from 'express'
import {
    addToCart,
    getCart,
    updateCart,
    removeProductFromCart,
    clearCart,
} from '../controllers/cartControllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'
const router = express.Router()

router.get('/', verifyToken, getCart) // getCart

router.put('/update', verifyToken, updateCart) // updateCart

router.delete('/removeProduct', verifyToken, removeProductFromCart) // removeProductFromCart

router.delete('/clear', verifyToken, clearCart) // clearCart

router.post('/add', verifyToken, addToCart) // addToCart

export default router
