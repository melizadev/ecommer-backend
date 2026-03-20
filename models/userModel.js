import mongoose from 'mongoose'
//define user schema for mongoDB
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 30,
        match: [
            /^[a-zA-Z0-9._-]+$/,
            'Username solo puede contener letras, números, ., _ y -',
        ],
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
})

export default mongoose.model('User', userSchema)
