const sinon = require('sinon')

/**
 * Before calling each test, we need to make sure that the route has access to all common params
 * such as DB models, logger, API request, etc.
 *
 * @param {object} router Koa router
 * @returns {object} Common router props `{ layer, emit, ctx }`
 */
const beforeEachSetup = (router) => {
  const stack = (router || {}).stack || []
  const layer = stack[stack.length - 1]
  const emit = sinon.spy()

  const query = sinon.stub().throws('error')

  const ctx = {
    app: { emit },
    request: {
      query: {},
    },
    params: {},
    logger: {
      log: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      warning: () => {},
      danger: () => {},
      error: () => {},
    },
    state: {},
    database: {
      Sequelize: {
        Op: {},
      },

      sequelizeInstance: {
        authenticate: query,
        QueryTypes: {},
        transaction: () => ({
          commit: () => {},
          rollback: () => {},
        }),
      },

      models: {},
    },
  }

  return {
    layer,
    emit,
    ctx,
  }
}


module.exports = beforeEachSetup
