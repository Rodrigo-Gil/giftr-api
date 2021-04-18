
import createDebug from 'debug'
import express from 'express'
import { User } from '../../models/index.js'
import { sanitizeBody, auth, api } from '../../middleware/index.js'

const debug = createDebug('giftr_api:auth')
const router = express.Router()

// Register a new user
router.post('/users', api, sanitizeBody, async (req, res, next) => {
  try {
    const newUser = new User(req.sanitizedBody)
    await newUser.save()
    res.status(201).send({data: newUser})
  } catch (err) {
    debug('Error saving new user: ', err.message)
    next(err)
  }
})

// Login a user and return an authentication token.
router.post('/tokens', sanitizeBody, api, async (req, res, next) => {
  try {
  const {email, password} = req.sanitizedBody
  const user = await User.authenticate(email, password)
  res.status(201).send({data: {token: user.generateAuthToken()}})
  } catch (err) {
    debug('Error returning a token: ', err.message)
    next(err)
  }
})

//login the current user
router.get('/users/me', auth, api, async (req, res, next) => {
  try{
  const user = await User.findById(req.user._id)
  res.send({ data: user })
  } catch (err) {
    debug('Error retrieving the current user ', err.message)
    next(err)
  }
})

//update password route
router.patch('/users/me', auth, api, sanitizeBody, async (req, res, next) => {
  try{
  const password = req.sanitizedBody
  const user = await User.findByIdAndUpdate(req.user._id, password)
  await user.save()
  res.send({ data: "Your password has been updated" })
  } catch (err) {
    debug('Error saving your new password', err)
    next(err)
  }
})

export default router