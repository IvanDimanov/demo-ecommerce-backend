const applyAllRoutes = require('./applyAllRoutes')
const catchError = require('./catchError')
const HttpError = require('./HttpError')
const logger = require('./logger')
const notFound = require('./notFound')
const onError = require('./onError')
const parseSelectFromQuery = require('./parseSelectFromQuery')
const validator = require('./validator')

/**
 * This is the main middlewares object.
 * These classes serve as koa2 middlewares.
 *
 * @namespace koa
 */
module.exports = {
  applyAllRoutes,
  catchError,
  HttpError,
  logger,
  notFound,
  parseSelectFromQuery,
  onError,
  validator,
}
