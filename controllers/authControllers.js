import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'
import { registerSchema, loginSchema } from '../schemas/authSchema.js'
import jwt from 'jsonwebtoken'
export const registerUser = async (req, res) => {
    try {
        console.log('Creando usuario...')
        const { username, email, password } = registerSchema.parse(req.body)

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const isFirstUser = (await userModel.countDocuments()) === 0

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: isFirstUser,
        })

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000,
        })

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: e.message })
    }
}

export const getUserProfile = async (req, res) => {
    const token = req.cookies.token
    console.log('Token received:', token)
    try {
        //decoding the token to get the user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.userId)
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        //return the user data if exists to the client
        res.status(201).json({
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } catch (e) {
        res.status(4001).json({ message: 'Invalid token' })
    }
}

export const loginUser = async (req, res) => {
    try {
        console.log('logueando usuario`')
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

        if (!JWT_SECRET_KEY) {
            return res
                .status(500)
                .json({ message: 'ddddd Server configuration error' })
        }
        const { email, password } = loginSchema.parse(req.body)
        const user = await userModel.findOne({ email })
        console.log('User found:', user)
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password' })
        }
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET_KEY,
            {
                expiresIn: '1h',
            }
        )
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        }
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
        })
            .status(200)
            .json(userData)
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                errors: e.errors,
            })
        }

        console.error(e)

        res.status(500).json({
            message: 'Internal server error',
        })
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    })
        .status(200)
        .json({ message: 'Logout successful' })
}
