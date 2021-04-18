
import createDebug from 'debug'
import express from 'express'
import { Person, User } from '../models/index.js'
import { auth, api, sanitizeBody }  from '../middleware/index.js'
import resourceNotFound from '../exceptions/resourceNotFound.js'

const debug = createDebug('giftr:routes:people')
const router = express.Router()

//getting all the people
router.get('/', auth, api, async (req, res, next) => {
  try {
  const user = await User.findById(req.user._id)
  const collection = await Person.find({ owner: user })
  if (!collection) {
    throw new resourceNotFound(`We could not find a person with the id: ${req.params.id}`)
  }
  res.send({ data: collection })
  } catch (err) {
    debug('error getting all people', err.message)
    next(err)
  }
})

//creating a person
router.post('/', sanitizeBody, auth, api, async (req, res, next) => {
  let newDocument = new Person(req.sanitizedBody)
  try {
    await newDocument.save()
    res.status(201).send({ data: newDocument })
  } catch (err) {
    debug('error creating a person on the db', err.message)
    next(err)
  }
})

//getting a person by ID, gift ideas populated
router.get('/:id', auth, api, async (req, res, next) => {
  try {
    const document = await Person.findById( req.params.id ).populate('gifts')
    if (!document) {
      throw new resourceNotFound(`We could not find a person with the id: ${req.params.id}`)
    }
    res.send({ data: document })
  } catch (err) {
    debug('error getting a person by id', err.message)
    next(err)
  }
})

const update = (overwrite = false) => async (req, res) => {
  try {
    const document = await Person.findByIdAndUpdate(
      req.params.id,
      req.sanitizedBody,
      {
        new: true,
        overwrite,
        runValidators: true,
      }
    )
    if (!document) throw new Error('Resource not found')
    res.send({ data: document })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
}

//replace a person
router.put('/:id', auth, api, sanitizeBody, update(true))

//updating a person
router.patch('/:id', auth, api, sanitizeBody, update(false))

//deleting a person
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Person.findByIdAndRemove(req.params.id)
    if (!document) {
      throw new resourceNotFound(`We could not find a person with the id ${req.params.id}`)
    }
    res.send({ data: document })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

export default router
