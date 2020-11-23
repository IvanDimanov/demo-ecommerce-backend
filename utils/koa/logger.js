const logger = require('koa-logger')
const jsonSafeStringify = require('../jsonSafeStringify')

/**
 * This middleware have 2 functions.
 * 1) is to use `koa-logger` for tracking all app activities, and
 * 2) is to provide the app with logging functions like `ctx.logger.info()`
 *
 * @memberof koa
 * @param {object} ctx Koa context
 * @param {Function} next Koa next middleware
 * @returns {object} `koa-logger` middleware
 */
const customLogger = (ctx, next) => {
  let method = ''
  let url = ''

  /**
   * Extends the Koa context with `ctx.logger.*` functions that have common logging format
   *
   * @param {string} prefix the type of log
   * @returns {Function} a text message to the console
   */
  function log(prefix = 'INFO') {
    return (message = '', data = {}) => {
      return process.stdout.write(
          `${new Date().toISOString()} ${prefix} - ${method} ${url}` +
          ` - ${message} ${jsonSafeStringify(data)}\n`
      )
    }
  }

  ctx.logger = {
    log: log(),
    debug: log('DEBUG'),
    info: log('INFO'),
    warn: log('WARN'),
    warning: log('WARNING'),
    danger: log('DANGER'),
    error: log('ERROR'),
  }

  return logger((str, [format, _method, _url]) => {
    method = _method
    url = _url

    process.stdout.write(`${new Date().toISOString()}${str}\n`)
  })(ctx, next)
}

module.exports = customLogger
