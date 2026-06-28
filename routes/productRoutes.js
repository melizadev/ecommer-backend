import express from 'express'
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from '../controllers/productControllers.js'

const router = express.Router()
router.get('/', getProducts)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.get('/:id', getProductById)
router.delete('/:id', deleteProduct)

export default router
