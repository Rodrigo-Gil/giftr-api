
import mongoose from 'mongoose'
import createDebug from 'debug'

const debug = createDebug('giftr:db')

export default function () {
    mongoose.connect('mongodb://localhost:27017/mad9124', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        debug('Successfully connected to the Database ...')
    })
    .catch((err) => {
        debug('Error connecting to the Database ...', err.message)
        process.exit(1)
    })
}