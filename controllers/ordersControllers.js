import OrderModel from '../models/orderModel.js'
import CartModel from '../models/CartModel.js'
import ProductModel from '../models/productModel.js'

export const checkout = async (req, res) => {
    try {
        const userId = req.user.userId
        const cart = await CartModel.findOne({ userId }).populate(
            'products.productId'
        )
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty',
            })
        }
        const items = cart.products.map((item) => ({
            productId: item.productId._id,
            title: item.productId.title,
            price: item.productId.price,
            image: item.productId.imageUrl,
            quantity: item.quantity,
        }))

        const totalAmount = cart.products.reduce((acc, item) => {
            return acc + item.productId.price * item.quantity
        }, 0)

        const order = await OrderModel.create({
            userId,
            items,
            totalAmount,
            status: 'pending',
            payment: {
                provider: 'fake',
                status: 'pending',
            },
        })
        console.log(order._id)
        res.status(200).json({
            message: 'Order created successfully',
            cartItems: cart.products,
            totalAmount,
            orderId: order._id,
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Error creating purchase order',
            error: error.message,
        })
    }
}

export const getOrderData = async (req, res) => {
    try {
        const { orderId } = req.params
        const userId = req.user.userId

        const order = await OrderModel.findOne({
            _id: orderId,
            userId,
        })

        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
            })
        }

        return res.status(200).json({
            message: 'Order retrieved successfully',
            order,
        })
    } catch (error) {
        console.error('Error getting order:', error)

        return res.status(500).json({
            message: 'Error retrieving order',
            error: error.message,
        })
    }
}

export const payOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        const userId = req.user.userId
        const cart = await CartModel.findOne({ userId }).populate(
            'products.productId'
        )
        const order = await OrderModel.findOne({
            _id: orderId,
            userId,
        })

        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
            })
        }

        if (order.payment.status === 'paid') {
            return res.status(400).json({
                message: 'Order already paid',
            })
        }

        order.orderStatus = 'completed'

        order.payment = {
            ...order.payment,
            status: 'approved',
            paidAt: new Date(),
            paymentId: `FAKE_${Date.now()}`,
        }
        if (cart) {
            cart.products = []
        }
        for (const item of order.items) {
            const product = await ProductModel.findById(item.productId)

            if (!product) {
                return res.status(404).json({
                    message: 'Product not found',
                })
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.title}`,
                })
            }

            product.stock -= item.quantity
            await product.save()
        }
        await cart.save()
        await order.save()

        return res.status(200).json({
            message: 'Payment successful',
            order,
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Error processing payment',
        })
    }
}

export const getOrders = async (req, res) => {
    try {
        const userId = req.user.userId

        const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 })

        return res.status(200).json({
            orders,
        })
    } catch (error) {
        console.error('Error fetching orders:', error)

        return res.status(500).json({
            message: 'Error fetching orders',
        })
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        const userId = req.user.userId
        const order = await OrderModel.findOne({
            _id: orderId,
            userId,
        })

        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
            })
        }

        if (order.payment.status === 'paid') {
            return res.status(400).json({
                message: 'Cannot cancel a paid order',
            })
        }

        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({
                message: 'Order already cancelled',
            })
        }

        order.orderStatus = 'cancelled'

        order.payment = {
            ...order.payment,
            status: 'cancelled',
        }

        await order.save()

        return res.status(200).json({
            message: 'Order cancelled successfully',
        })
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Error cancelling order',
        })
    }
}
