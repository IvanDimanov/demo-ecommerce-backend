/**
 * Returns a koa middleware that will execute `next()` in a safe wrapper.
 * If `next()` throws during execution, we'll catch the error and emit it.
 *
 * @memberof koa
 * @returns {Function} koa wrapper middleware
 */
const catchError = () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      // pass detailed originating error class when database logging is enabled
      process.env.DB_LOGGING && (error.message = `${error.name}: ${error.message}`)
      ctx.app.emit('error', error, ctx)
    }
  }
}

module.exports = catchError
