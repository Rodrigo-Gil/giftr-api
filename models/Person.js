import mongoose from 'mongoose'
import User from './User.js'
import Gift from './Gift.js'

const schema = new mongoose.Schema({
    name: { type: String, required: true, maxLength: 254 },
    birthDate: { type: Date, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: true,
      default: this.type
      },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
      },
    ],
    gifts: [ Gift ],
    imageUrl: { type: String , maxLength: 1024 },
  },
  {
    timestamps: true,
  }
)

const Model = mongoose.model('Person', schema)

export default Model
