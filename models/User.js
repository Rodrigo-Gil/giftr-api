import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import uniqueValidator from 'mongoose-unique-validator'
import validator from 'validator'

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
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} is not a valid email address`,
    },
    set: function (value) {
      return value.toLowerCase()
    },
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

schema.pre('findOneAndUpdate', async function (next) {
  //handling the password update
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, saltRounds)
  }
  next()
})

//deleting sensitive information on json responses
schema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}

//registering the validator plugin for the email
schema.plugin(uniqueValidator, {
  message: function (props) {
    if (props.path === 'email') {
      return `The email address '${props.value}' is already registered.`
    } else {
      return `The ${props.path} must be unique. '${props.value}' is already in use.`
    }
  },
})

const Model = mongoose.model('User', schema)

export default Model
