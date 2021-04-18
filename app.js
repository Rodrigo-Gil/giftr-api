'use strict'

//importing all the dependencies
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import sanitizeMongo from 'express-mongo-sanitize'


//importing all the routers
import authRouter from './routes/auth/index.js'
import peopleRouter from './routes/people.js'
import giftRouter from './routes/gifts.js'

const app = express()

//initializing the database
import connectDB from './startup/connectDatabase.js'
connectDB()

app.use(morgan('tiny'))
app.use(helmet())
app.use(express.json())
app.use(sanitizeMongo())

//routes
app.use('/auth', authRouter)
app.use('/api/people', peopleRouter)
app.use('/api/people', giftRouter)

export default app