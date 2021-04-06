
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    firstName: { type: String, required: true, maxLength: 64 },
    lastName: { type: String, required: true, maxLength: 64 },
    email: { type: String, required: true, maxLength: 512, Unique: true },
    password: { type: String, required: true, maxLength: 70 }
    }
)

const Model = mongoose.model('User', schema)

export default Model