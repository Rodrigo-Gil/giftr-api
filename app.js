'use strict'

//importing all the dependencies
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import sanitizeMongo from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'

//registering the error handlers
import { logError, errorHandler } from './middleware/index.js'


//importing all the routers
import { authRouter, peopleRouter, giftRouter } from './routes/index.js'

const app = express()

//initializing the database
import connectDB from './startup/connectDatabase.js'
connectDB()

//Health Check route
app.get('/', (req, res) => res.send({data: { healthStatus: 'UP'}}))

app.use(morgan('tiny'))
app.use(helmet())
app.use(express.json())
app.use(sanitizeMongo())
app.use(compression())
app.use(cors())

//routes
app.use('/auth', authRouter)
app.use('/api/people', peopleRouter)
app.use('/api/people', giftRouter)

//error handlers
app.use(logError)
app.use(errorHandler)

export default app