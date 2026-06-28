import CartModel from '../models/CartModel.js'
import ProductModel from '../models/ProductModel.js'

export const addToCart = async (req, res) => {
    try {
        console.log('adding to cart')
        const user = req.user
        const userId = req.user.userId
        const { productId, quantity = 1 } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'User id is required' })
        }

        if (!productId) {
            return res.status(400).json({ message: 'Product id is required' })
        }

        if (quantity < 1) {
            return res
                .status(400)
                .json({ message: 'Quantity must be at least 1' })
        }

        const product = await ProductModel.findById(productId)

        if (!product) {
            return res.status(400).json({ message: 'Product not found' })
        }

        let cart = await CartModel.findOne({ userId })

        if (cart) {
            console.log('User has a cart already')

            const productIndex = cart.products.findIndex((p) => {
                return p.productId._id
                    ? p.productId._id.toString() === productId
                    : p.productId.toString() === productId
            })
            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `there are ${product.stock} units available`,
                })
            }

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity
            } else {
                console.log('user dont have a shopping cart')

                cart.products.push({ productId, quantity })
            }
        } else {
            cart = new CartModel({
                userId,
                products: [{ productId, quantity }],
            })
        }

        await cart.save()

        await cart.populate('products.productId')

        const totalAmount = cart.products.reduce((acc, item) => {
            return acc + item.productId.price * item.quantity
        }, 0)

        const totalQuantity = cart.products.reduce((acc, item) => {
            return acc + item.quantity
        }, 0)

        res.status(200).json({
            message: 'Product add to cart successfully',
            cartItems: cart.products,
            totalAmount,
            totalQuantity,
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Server error adding product to cart',
        })
    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user.userId
        const cart = await CartModel.findOne({ userId }).populate(
            'products.productId'
        )
        console.log(cart)
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            })
        }

        const totalAmount = cart.products.reduce((acc, item) => {
            return acc + item.productId.price * item.quantity
        }, 0)

        const totalQuantity = cart.products.reduce((acc, item) => {
            return acc + item.quantity
        }, 0)

        res.status(200).json({
            message: 'Cart obtained successfully',
            cartItems: cart.products,
            totalAmount,
            totalQuantity,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server error obtaining cart',
        })
    }
}

export const updateCart = async (req, res) => {
    try {
        const userId = req.user.userId
        const { productId, quantity } = req.body
        console.log('UPDATE CART', productId, quantity)

        const cart = await CartModel.findOne({ userId })

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' })
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        )

        if (productIndex > -1) {
            const product = await ProductModel.findById(productId)

            if (!product) {
                return res.status(404).json({
                    message: 'Product not found',
                })
            }

            if (quantity > product.stock) {
                return res.status(400).json({
                    message: `There are ${product.stock} units available`,
                })
            }

            cart.products[productIndex].quantity = quantity

            await cart.save()

            res.status(200).json({
                message: 'Cart updated successfully',
                cart,
            })
        } else {
            res.status(404).json({
                message: 'Product not found',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Server error updating cart',
        })
    }
}

export const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.user.userId
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({
                message: 'Product id required',
            })
        }

        const cart = await CartModel.findOne({ userId })

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found',
            })
        }

        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        )

        if (productIndex > -1) {
            const product = cart.products[productIndex]

            if (product.quantity > 1) {
                product.quantity -= 1
            } else {
                cart.products.splice(productIndex, 1)
            }

            await cart.save()

            await cart.populate('products.productId')

            const totalAmount = cart.products.reduce((acc, item) => {
                return acc + item.productId.price * item.quantity
            }, 0)

            const totalQuantity = cart.products.reduce((acc, item) => {
                return acc + item.quantity
            }, 0)

            return res.status(200).json({
                message: 'Producto actualizado correctamente',
                cartItems: cart.products,
                totalAmount,
                totalQuantity,
            })
        }

        const totalAmount = cart.products.reduce((acc, item) => {
            return acc + item.productId.price * item.quantity
        }, 0)

        const totalQuantity = cart.products.reduce((acc, item) => {
            return acc + item.quantity
        }, 0)

        return res.status(200).json({
            message: 'Product deleted from cart successfully',
            cartItems: cart.products,
            totalAmount,
            totalQuantity,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error deleting cart',
        })
    }
}

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId

        const cart = await CartModel.findOne({ userId })

        if (cart) {
            cart.products = []
            await cart.save()
            res.status(200).json({
                message: 'Cart successfully emptied',
                cart,
            })
        } else {
            res.status(404).json({
                message: 'Cart not found',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Server error emptying shopping cart',
        })
    }
}
