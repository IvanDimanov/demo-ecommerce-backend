const { v4: uuidv4 } = require('uuid')

/**
 * Extends over the global `Error`.
 * This class is used to create errors that have more code related info for easy tracking and
 * have Human readable error reason for direct use in FrontEnd.
 *
 * @memberof koa
 */
class HttpError extends Error {
  /**
   * @param {number} status HTTP status code, example `400`, `401`, `500`
   * @param {string} code Internal error code, example `NOT_IN_GROUP`, `NO_PERMISSION`
   * @param {string} message Human readable reason for the error.
   * @param {any} data Any additional info that needs to be logged
   */
  constructor(
    status = 500,
    code = 'INTERNAL_SERVER_ERROR',
    message = 'Internal Server Error',
    data = undefined
  ) {
    super(message)

    this.name = 'HttpError'
    this.id = uuidv4()
    this.status = status
    this.code = code
    this.data = data
  }
}

module.exports = HttpError
