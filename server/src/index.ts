import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { profileRoute } from './routes/profile'
import { planRoute } from './routes/plan'
 
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use("/api/profile", profileRoute)
app.use("/api/plan", planRoute)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})