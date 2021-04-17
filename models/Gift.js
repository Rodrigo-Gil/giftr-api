import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 4,  maxLength: 64 },
  price: 
  {
    type: Number,
    get: getAmount,
    set: setAmount,
    minLength: 100,
    default: 1000
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

//getters and setters for the price
function setAmount(num) {
  return num * 100;
}
function getAmount(num) {
  return (num/100).toFixed(2);
}

const Model = mongoose.model('Gift', schema)

export default Model
