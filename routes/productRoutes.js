import express from 'express'
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
} from '../controllers/productControllers.js'

const router = express.Router()
router.post('/', createProduct)
router.put('/', updateProduct)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.delete('/:id', deleteProduct)

export default router
