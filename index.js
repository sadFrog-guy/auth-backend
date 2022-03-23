import mongoose from 'mongoose'
import express from 'express'
import authRouter from "./AuthRouter.js";

const DB_URL = 'mongodb+srv://adikokey:123@cluster0.csn3v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = 5000

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => {
            console.log('server is started on port ' + PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()