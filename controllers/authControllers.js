import bcrypt from 'bcryptjs'
import UserModel from '../models/userModel.js'
import { registerSchema, loginSchema } from '../schemas/authSchema.js'
import jwt from 'jsonwebtoken'
import { cookieOptions } from '../utils/coockieOptions.js'
import { ZodError } from 'zod'
import { generateToken } from '../utils/generateToken.js'
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = registerSchema.parse(req.body)

        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const isFirstUser = (await UserModel.countDocuments()) === 0

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: isFirstUser,
        })

        const token = generateToken({
            userId: newUser._id,
        })

        res.cookie('token', token, cookieOptions)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
        })
    } catch (e) {
        res.status(500).json({ message: 'Server error registering user' })
    }
}

export const getUserProfile = async (req, res) => {
    const token = req.cookies.token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

export const loginUser = async (req, res) => {
    try {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

        if (!JWT_SECRET_KEY) {
            return res
                .status(500)
                .json({ message: 'Server configuration error' })
        }
        const { email, password } = loginSchema.parse(req.body)
        const user = await UserModel.findOne({ email })
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
        const token = generateToken({
            userId: user._id,
        })

        res.cookie('token', token, cookieOptions).status(200).json({
            message: 'Login successful',
        })
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                errors: e.errors,
            })
        }

        res.status(500).json({
            message: 'Internal server error',
        })
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('token', cookieOptions)
        .status(200)
        .json({ message: 'Logout successful' })
}
