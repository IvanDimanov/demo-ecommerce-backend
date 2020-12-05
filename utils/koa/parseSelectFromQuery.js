const JSON5 = require('json5')

/**
 * When sending query data to our APIs
 * some platforms such as Swagger send the JSON data as a String.
 * This middleware will get the sent `select` query data and try to parse it back to JSON Object.
 *
 * @memberof koa
 * @param {object} ctx Koa context
 * @param {Function} next Koa next middleware
 * @returns {undefined} No need to return anything since the query is updated for the next Koa middleware
 */
const parseSelectFromQuery = async (ctx, next) => {
  const { select } = ctx.request.query

  if (typeof select === 'string') {
    try {
      ctx.request.query.select = JSON5.parse(select)
    } catch (error) {
      ctx.request.query.select = {}
    }
  }

  await next()
}

module.exports = parseSelectFromQuery
