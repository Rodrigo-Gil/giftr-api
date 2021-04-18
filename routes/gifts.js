import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import Gift from '../models/Gift.js'
import express from 'express'
import api from '../middleware/api.js'
import Person from '../models/Person.js'
import auth from '../middleware/auth.js'


const debug = createDebug('giftr:routes:gifts')
const router = express.Router()


//creating new gifts 
router.post('/:id/gifts', api, auth, sanitizeBody, async (req, res) => {
  let newDocument = new Gift (req.sanitizeBody)

  try {
    await newDocument.save()
    let savedDoc = await Person.findById({ _id: req.params.id})
    await savedDoc.gifts.push( newDocument._id )
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