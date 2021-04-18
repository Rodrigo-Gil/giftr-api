import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 4,  maxLength: 64 },
  price: {
    type: Number, 
    minLength: 100,
    default: 1000,
    set: value => Math.ceil(value)
  },
  imageUrl: { type: String, minLength: 1024, },
  store: {
      name: {
      type: String,
      maxLength: 254,
    },
    productURL: {
      type: String,
      maxLength: 1024,
    },
  },
})

const Model = mongoose.model('Gift', schema)

export default Model
