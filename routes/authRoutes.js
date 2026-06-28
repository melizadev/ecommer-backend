import express from 'express'
import {
    registerUser,
    getUserProfile,
    loginUser,
    logoutUser,
} from '../controllers/authControllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.json({ message: 'connected to the backend' })
})

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/profile', verifyToken, getUserProfile)

export default router
