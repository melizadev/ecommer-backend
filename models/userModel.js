import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
        match: [/^\S+@\S+\.\S+$/, 'invalid email'],
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
            'Username can just contain letters, numbers, ., _ and -',
        ],
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
})

const UserModel = mongoose.model('User', userSchema)

export default UserModel
