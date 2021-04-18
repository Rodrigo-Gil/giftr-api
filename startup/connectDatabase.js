
import mongoose from 'mongoose'
import logger from './logger.js'

const log = logger.child({ module: 'connectDB'})

export default function () {
    mongoose.connect('mongodb://localhost:27017/mad9124', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        log.info('Successfully connected to the Database ...')
    })
    .catch((err) => {
        log.error('Error connecting to the Database ...', err.message)
        process.exit(1)
    })
}