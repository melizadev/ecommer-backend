import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)
const ProductModel =
    mongoose.models.Product || mongoose.model('Product', productSchema)

export default ProductModel
