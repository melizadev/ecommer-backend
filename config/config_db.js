import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export const connectDB = async () => {
    try {
        const dbUrl = process.env.MONGO_DB_URL.replace(
            '<db_username>',
            process.env.MONGO_DB_USERNAME
        )
            .replace('<db_password>', process.env.MONGO_DB_PASSWORD)
            .replace('<db_name>', process.env.MONGO_DB_NAME)
        await mongoose.connect(dbUrl)
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log('Disconnected from MongoDB')
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error)
    }
}
