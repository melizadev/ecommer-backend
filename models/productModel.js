import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
    },
    category: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
    },
    price: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
    },
    price: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        minLength: 6,
        maxLength: 254,
    },
})

export default mongoose.model('Product', ProductSchema)
