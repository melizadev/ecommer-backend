import express from 'express'
import {
    registerUser,
    getUserProfile,
    loginUser,
} from '../controllers/authControllers.js'
const router = express.Router()
router.get('/', (req, res) => {
    res.json({ messsage: 'contectado al backend' })
})

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/profile', getUserProfile)

router.post('/logout', (req, res) => {
    console.log('You do a petition to logout')
    res.json({ message: 'Login successful' })
})

router.get('/profile', getUserProfile)

router.post('/logout', (req, res) => {
    console.log('You do a petition to logout')
    res.json({ message: 'Logout successful' })
})

export default router
