import http from 'http'
import app from './app.js'
import logger from './startup/logger.js'

const log = logger.child({ module: 'server' })

const httpServer = http.createServer(app)

const port = process.env.API_PORT || 3030
httpServer.listen(port, () => {
  log.info(`HTTP server listening on port ${port}`)
})
