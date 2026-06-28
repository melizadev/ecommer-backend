import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },

                title: {
                    type: String,
                    required: true,
                },

                image: {
                    type: String,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        orderStatus: {
            type: String,
            enum: ['pending', 'completed', 'cancelled', 'shipped', 'delivered'],
            default: 'pending',
        },

        payment: {
            provider: {
                type: String,
                enum: ['fake', 'paypal', 'stripe'],
                default: 'fake',
            },

            paymentId: {
                type: String,
                default: null,
            },

            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected', 'cancelled'],
                default: 'pending',
            },
        },
    },
    {
        timestamps: true,
    }
)

const OrderModel = mongoose.model('Order', orderSchema)

export default OrderModel
