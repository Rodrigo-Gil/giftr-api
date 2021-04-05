'use strict'

//importing all the dependencies
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'


const app = express()

//initializing the database
import connectDB from './startup/connectDatabase.js'
connectDB()


app.use(morgan('tiny'))
app.use(helmet())
app.use(express.json())

const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
})

export default app