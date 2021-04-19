
import express from 'express'
import { api, auth, sanitizeBody } from '../middleware/index.js'
import { Gift, Person } from '../models/index.js'
import resourceNotFound from '../exceptions/resourceNotFound.js'
import logger from '../startup/logger.js'


const log = logger.child({ module: 'giftRoute'})
const router = express.Router()


//creating new gifts 
router.post('/:id/gifts', api, auth, sanitizeBody, async (req, res, next) => {
    const newDocument = new Gift(req.sanitizedBody)
  try {
    await newDocument.save()
    const savedDoc = await Person.findById(req.params.id)
    savedDoc.gifts.push(newDocument._id)
    await savedDoc.save()
    const popDoc = await Person.findById(req.params.id).populate('gifts')
    res.status(201).send({ data: popDoc })
  } catch (err) {
    log.error('Error creating a new gift', err.message)
    next(err)
  }
})

const update = (overwrite = false) => async (req, res, next) => {
  try {
    const gift = await Gift.findByIdAndUpdate(
      req.params.giftId,
      req.sanitizedBody,
      {
        new: true,
        overwrite,
        runValidators: true,
      }
    )
    if (!gift) {
      throw new resourceNotFound(`We could not find a gift with the id ${req.params.giftId}`)
    }
    res.send({ data: gift })
  } catch (err) {
    log.error('Error updating the document', err.message)
    next(err)
  }
}

//updating gifts
router.patch('/:id/gifts/:giftId', api, auth, sanitizeBody, update(false))

//delete gifts
router.delete('/:id/gifts/:giftId', api, auth, async (req, res, next) => {
  try { 
    const gift = await Gift.findByIdAndRemove(req.params.giftId)
    if (!gift) {
      throw new resourceNotFound(`We could not find a gift with the id ${req.params.giftId} for the person
      ${req.params.id}`)
    }
    res.send({ data: gift })
  } catch (err) {
    log.error('Error deleting the gift', err.message)
    next(err)
  }
})

export default router