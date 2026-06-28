import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import {
    checkout,
    getOrderData,
    payOrder,
    getOrders,
    cancelOrder,
} from '../controllers/ordersControllers.js'
const router = express.Router()
router.get('/', verifyToken, getOrders)
router.post('/checkout', verifyToken, checkout)
router.get('/:orderId', verifyToken, getOrderData)
router.post('/:orderId/pay', verifyToken, payOrder)
router.patch('/:orderId/cancel', verifyToken, cancelOrder)
export default router
