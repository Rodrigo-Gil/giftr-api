import sanitizeBody from '../../middleware/sanitizeBody.js'
import { Gift } from '../../models/index.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  const collection = await Gift.find().populate('owner')
  res.send({ data: collection })
})

router.post('/', sanitizeBody, async (req, res) => {
  let newDocument = new Gift(req.sanitizeBody)
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

router.get('./:id', async (req, res) => {
  try {
    const Gift = await Gift.findById(req.params.id).populate('owner')
    if (!Gift) throw new Error('Resource not found')
    res.send({ data: Gift })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

const update = (overwrite = false) => async (req, res) => {
  try {
    const course = await Gift.findByIdAndUpdate(
      req.params.id,
      req.sanitizedBody,
      {
        new: true,
        overwrite,
        runValidators: true,
      }
    )
    if (!course) throw new Error('Resource not found')
    res.send({ data: course })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
}

router.put('/:id', sanitizeBody, update(true))
router.patch('/:id', sanitizeBody, update(false))

router.delete('/:id', async (req, res) => {
  try {
    const Gift = await Gift.findByIdAndRemove(req.params.id)
    if (!Gift) throw new Error('Resource not found')
    res.send({ data: Gift })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})
