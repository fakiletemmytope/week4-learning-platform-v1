import mongoose from "mongoose"
import { configDotenv } from "dotenv"

configDotenv()
const { connect, connection } = mongoose
const URI = process.env.DATABASEURL || "mongodb+srv://fakiletemitope2:*.Oluwaseyi88.*@cluster0.to8n4fl.mongodb.net/learning_platform?retryWrites=true&w=majority&appName=Cluster0"


export const dbConnect = async () => {
    try {
        // console.log(URI)
        await connect(`${URI}`)
        console.log('MongoDB connected successfully!')
        return
    }
    catch (error) {
        console.log(error.message)
        await connection.close()
        throw error
    }
}

export const dbClose = async () => {
    if (connection.readyState === 1) {
        await connection.close()
        console.log("Database connection closed!")
    }
}