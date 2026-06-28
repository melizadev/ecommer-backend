import { productSchema } from '../schemas/productSchema.js'
import ProductSchema from '../models/productModel.js'

export const createProduct = async (req, res) => {
    try {
        const data = productSchema.parse(req.body)
        const product = await ProductSchema.create(data)

        res.status(201).json({
            message: 'Product created correctly',
            product,
        })
    } catch (error) {
        res.status(400).json({
            message: error.message,
            code: error.code,
            keyValue: error.keyValue,
        })
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await ProductSchema.find()

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            message: 'Error obtaining products',
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        const product = await ProductSchema.findById(id)

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({
            message: 'Error obtaining product',
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params

        const validation = productSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: 'Invalid data',
                errors: validation.error.errors,
            })
        }

        const updatedProduct = await ProductSchema.findByIdAndUpdate(
            id,
            validation.data,
            {
                new: true,
            }
        )

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }

        res.status(200).json({
            message: 'Updated product',
            product: updatedProduct,
        })
    } catch (error) {
        res.status(400).json({
            message: 'Server error updating product',
            code: error.code,
            keyValue: error.keyValue,
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const deletedProduct = await ProductSchema.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }

        res.status(200).json({
            message: 'Product deleted correctly',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting product',
        })
    }
}
