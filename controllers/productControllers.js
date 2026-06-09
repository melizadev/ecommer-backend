import { productSchema } from '../schemas/productSchema.js'
import ProductSchema from '../models/productModel.js'

export const createProduct = async (req, res) => {
    try {
        const validation = productSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: validation.error.errors,
            })
        }

        const product = await ProductSchema.create(validation.data)

        res.status(201).json({
            message: 'Producto creado correctamente',
            product,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear producto',
            error: error.message,
        })
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await ProductSchema.find()

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener productos',
            error: error.message,
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        const product = await ProductSchema.findById(id)

        if (!product) {
            return res.status(404).json({
                message: 'Producto no encontrado',
            })
        }

        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener producto',
            error: error.message,
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params

        const validation = productSchema.safeParse(req.body)

        if (!validation.success) {
            return res.status(400).json({
                message: 'Datos inválidos',
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
                message: 'Producto no encontrado',
            })
        }

        res.status(200).json({
            message: 'Producto actualizado',
            product: updatedProduct,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar producto',
            error: error.message,
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const deletedProduct = await ProductSchema.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(404).json({
                message: 'Producto no encontrado',
            })
        }

        res.status(200).json({
            message: 'Producto eliminado correctamente',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar producto',
            error: error.message,
        })
    }
}
