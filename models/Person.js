import mongoose from 'mongoose'


const schema = new mongoose.Schema({
    name: { type: String, required: true, maxLength: 254 },
    birthDate: { type: Date, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
      required: true,
      default: 'type'
      },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
      },
    ],
    gifts: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'Gift',
      }
    ],
    imageUrl: { type: String , maxLength: 1024 },
  },
  {
    timestamps: true,
  }
)


const Model = mongoose.model('Person', schema)

export default Model
