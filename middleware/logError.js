
import logger from '../startup/logger.js'

const log = logger.child({ module: 'logError'})

export default function logErrors (err, req, res, next) {
    log.error(err)
    next(err)
}