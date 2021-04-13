import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const saltRounds = 14
const jwtSecretKey = 'superSecretKey'

const schema = new mongoose.Schema({
  firstName: { type: String, trim: true, maxLength: 64, required: true },
  lastName: { type: String, trim: true, maxLength: 64, required: true },
  email: {
    type: String,
    trim: true,
    maxLength: 512,
    unique: true,
    required: true,
  },
  password: { type: String, trim: true, maxLength: 70, required: true },
})

schema.methods.generateAuthToken = function () {
  const payload = { uid: this._id }
  return jwt.sign(payload, jwtSecretKey)
}

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email })

  const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
  const hashedPassword = user ? user.password : badHash
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword)

  return passwordDidMatch ? user : null
}

schema.pre('save', async function (next) {
  // Only encrypt if the password property is being changed.
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, saltRounds)
  next()
})

const Model = mongoose.model('User', schema)

export default Model
