'use strict'

//importing all the dependencies
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import sanitizeMongo from 'express-mongo-sanitize'
import compression from 'compression'
import cors from 'cors'
import log from './startup/logger.js'

//registering the error handlers
import { logError, errorHandler } from './middleware/index.js'

//importing all the routers
import { authRouter, peopleRouter, giftRouter } from './routes/index.js'

const app = express()

//initializing the database
import connectDB from './startup/connectDatabase.js'
connectDB()

log.info(process.env.NODE_ENV)
log.warn(app.get('env')) //if NODE_ENV is undefined, returns development

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))
app.use(express.json())
app.use(sanitizeMongo())

//Health Check route
app.get('/', (req, res) => res.send({ data: { healthStatus: 'UP' } }))
//routes
app.use('/auth', authRouter)
app.use('/api/people', peopleRouter)
app.use('/api/people', giftRouter)

//error handlers
app.use(logError)
app.use(errorHandler)

export default app
