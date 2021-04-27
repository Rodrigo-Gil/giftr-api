import express from 'express'
import { User } from '../../models/index.js'
import { sanitizeBody, auth, api } from '../../middleware/index.js'
import logger from '../../startup/logger.js'

const log = logger.child({ module: 'authRoute ' })
const router = express.Router()

// Register a new user
router.post('/users', api, sanitizeBody, async (req, res, next) => {
  try {
    const newUser = new User(req.sanitizedBody)
    await newUser.save()
    res.status(201).send({ data: newUser })
  } catch (err) {
    log.error('Error saving new user: ', err.message)
    next(err)
  }
})

// Login a user and return an authentication token.
router.post('/tokens', api, sanitizeBody, async (req, res, next) => {
  try {
    const { email, password } = req.sanitizedBody
    const user = await User.authenticate(email, password)
    res.status(201).send({ data: { token: user.generateAuthToken() } })
  } catch (err) {
    log.error('Error returning a token: ', err.message)
    next(err)
  }
})

//login the current user
router.get('/users/me', auth, api, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.send({ data: user })
  } catch (err) {
    log.error('Error retrieving the current user ', err.message)
    next(err)
  }
})

//update password route
router.patch('/users/me', api, auth, sanitizeBody, async (req, res, next) => {
  try {
    const password = req.sanitizedBody
    const user = await User.findByIdAndUpdate(req.user._id, password)
    await user.save()
    res.send({ data: 'Your password has been updated' })
  } catch (err) {
    log.error('Error saving your new password', err)
    next(err)
  }
})

export default router
