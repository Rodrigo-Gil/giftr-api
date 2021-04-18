import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import { Gift, Person } from '../models/index.js'
import express from 'express'
import api from '../middleware/api.js'
import auth from '../middleware/auth.js'


const debug = createDebug('giftr:routes:gifts')
const router = express.Router()


//creating new gifts 
router.post('/:id/gifts', auth, sanitizeBody, async (req, res, next) => {
    const newDocument = new Gift(req.sanitizedBody)
  try {
    await newDocument.save()
    const savedDoc = Person.findOne({_id: req.params.id})
    savedDoc.gifts.push(newDocument._id)
    await savedDoc.save()
    res.status(201).send({ data: savedDoc })
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

//updating gifts
router.patch(':id/gifts/:giftId', api, auth, sanitizeBody, update(false))

//delete gifts
router.delete(':id/gifts/:giftId', api, auth, async (req, res) => {
  try {
    const Gift = await Gift.findByIdAndRemove(req.params.id)
    if (!Gift) throw new Error('Resource not found')
    res.send({ data: Gift })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

export default router