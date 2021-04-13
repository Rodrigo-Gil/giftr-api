
import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import createDebug from 'debug'
import express from 'express'
import auth from '../../middleware/auth.js' 
import api from '../../middleware/api.js'

const debug = createDebug('giftr_api:auth')
const router = express.Router()

// Register a new user
router.post('/users', sanitizeBody, async (req, res) => {
  try {
    const newUser = new User(req.sanitizedBody)

    const itExists = Boolean(await User.countDocuments({email: newUser.email}))
    if (itExists) {
      return res.status(400).send({
        errors: [
          {
            status: '400',
            title: 'Validation Error',
            detail: `Email address '${newUser.email}' is already registered.`,
            source: {pointer: '/data/attributes/email'}
          }
        ]
      })
    }
    await newUser.save()
    res.status(201).send({data: newUser})
  } catch (err) {
    debug('Error saving new user: ', err.message)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.'
        }
      ]
    })
  }
})

// Login a user and return an authentication token.
router.post('/tokens', sanitizeBody, api, async (req, res) => {
  const {email, password} = req.sanitizedBody
  const user = await User.authenticate(email, password)

  if (!user) {
    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Incorrect username or password.'
        }
      ]
    })
  }
  res.status(201).send({data: {token: user.generateAuthToken()}})
})

//login the current user
router.get('/users/me', auth, api, async (req, res) => {
  const user = await User.findById(req.user._id)
  res.send({ data: user })
})

//update password route
router.patch('/users/me', auth, api, sanitizeBody, async (req, res) => {
  try{
  const password = req.sanitizedBody
  const user = await User.findByIdAndUpdate(req.user._id, password)
  await user.save()
  res.send({ data: "Your password has been updated" })
  } catch (err) {
    debug('Error saving your new password', err)
  }
})

export default router