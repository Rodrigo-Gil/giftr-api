import createDebug from 'debug'

const debug = createDebug('')

export default function logErrors (err, req, res, next) {
    debug(err)
    next(err)
}