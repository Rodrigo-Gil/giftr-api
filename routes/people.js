import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import Person from '../models/Person.js'
import express from 'express'
import auth from '../middleware/auth.js'
import api from '../middleware/api.js'

const debug = createDebug('giftr:routes:people')
const router = express.Router()

//getting all the people
router.get('/', auth, api, async (req, res) => {
  const collection = await Person.find()
  res.send({ data: collection })
})

//creating a person
router.post('/', sanitizeBody, auth, api, async (req, res) => {
  let newDocument = new Person(req.sanitizedBody)
  try {
    await newDocument.save()
    res.status(201).send({ data: newDocument })
  } catch (err) {
    debug(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.',
        },
      ],
    })
  }
})

//getting a person by ID, gift ideas populated
router.get('/:id', auth, api, async (req, res) => {
  try {
    const document = await Person.findById(req.params.id).populate('gifts')
    if (!document) throw new Error('Resource not found')

    res.send({ data: document })
  } catch (err) {
    sendResourceNotFound(req, res)
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
    if (!document) throw new Error('Resource not found')
    res.send({ data: document })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

function sendResourceNotFound(req, res) {
  res.status(404).send({
    error: [
      {
        status: '404',
        title: 'Resource does nto exist',
        description: `We could not find a person with id: ${req.params.id}`,
      },
    ],
  })
}

export default router
