const validateEnvVars = require('../utils/validateEnvVars')
const envVarsSchema = require('./envVarsSchema')
const { error } = validateEnvVars(envVarsSchema)
/* istanbul ignore next: because this involves killing the test if a ENV VAR is missing or invalid */
if (error) {
  process.stderr.write(`Invalid ENV VAR:
${error.details
      .map(({ message, context }) => `  ${message}; currently ${context.key}=${context.value}`)
      .join('\n')}
\n`,
  )
  process.exit(1)
}


const path = require('path')
const Koa = require('koa')
const koaBody = require('koa-body')
const helmet = require('koa-helmet')
const cors = require('@koa/cors')

const catchError = require('../utils/koa/catchError')
const logger = require('../utils/koa/logger')
const notFound = require('../utils/koa/notFound')
const onError = require('../utils/koa/onError')
const applyAllRoutes = require('../utils/koa/applyAllRoutes')

const database = require('../database')
const database2 = require('../database2')

const getPort = () => process.env.PORT

/**
 * Creates the main Koa app with all middlewares, APIs, logging, and error handling.
 *
 * @returns {object} Instance of Koa
 */
function createApp() {
  const app = new Koa()

  /* Provide access to PostgreSQL to all API routes */
  app.context.database = database
  app.context.database2 = database2


  app
      .use(helmet())
      .use(catchError())
      .use(logger)
      .use(koaBody({
        formLimit: '100mb',
        multipart: true,
      }))

  if (process.env.ALLOW_CORS) {
    app.use(cors({
      exposeHeaders: ['authorization'],
    }))
  }

  applyAllRoutes(app, path.join(__dirname, '/', 'routes'))

  app
      .use(notFound)
      .on('error', onError)

  return app
}

/* Check if this file is called for starting the app or called as additional module to already started app */
/* istanbul ignore next: because this involves loading file via `require` or executing the file directly from the terminal */
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    createApp,
    getPort,
  }
} else {
  const server = createApp().listen(getPort(), () => {
    process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`)
  })
}

/**
 * @swagger
 * definitions:
 *   ResponseError:
 *     type: object
 *     description: |
 *       Schema for `4XX` server error response body.
 *       Response includes a UUIDv4, error code and message body.
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *         example: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *       code:
 *         type: string
 *         example: GENERIC_SERVER_ERROR
 *       message:
 *         type: string
 *         example: Generic server error
 *     required:
 *       - id
 *       - code
 *       - message
 *
 * parameters:
 *   IdInPath:
 *     in: path
 *     name: id
 *     type: number
 *     format: integer
 *     required: true
 *     description: |
 *       The `id` property of the entity we want to retrieve.
 *
 *   IdInQuery:
 *     in: query
 *     name: id
 *     type: string
 *     format: uuid
 *     required: true
 *     description: |
 *       The `id` property of the entity we want to retrieve.
 *
 * responses:
 *   InvalidRequest:
 *     description: |
 *       Invalid parameters sent to the server.
 *     schema:
 *       $ref: '#/definitions/ResponseError'
 *     examples:
 *       application/json:
 *         id: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *         code: REQUEST_VALIDATION_ERROR
 *         message: Missing request "${type}"
 *
 *   AppNotFound:
 *     description: |
 *       Some unexpected issue occurred and crashed the app.
 *     schema:
 *       $ref: '#/definitions/ResponseError'
 *     examples:
 *       application/json:
 *         id: a34f4558-1b88-47cd-8d63-ae4eaf038bd7
 *         code: INTERNAL_SERVER_ERROR
 *         message: Internal server error
 */
