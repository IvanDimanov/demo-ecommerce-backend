const beforeEachSetup = require('./beforeEachSetup')
const getFirstRouteParams = require('./getFirstRouteParams')
const koaRouterRunner = require('./koaRouterRunner')
const loader = require('./loader')

/**
 * This is the main test utilities object.
 * These classes serve as tooling utilities around unit testing and coverage.
 *
 * @namespace testing
 */
module.exports = {
  beforeEachSetup,
  getFirstRouteParams,
  koaRouterRunner,
  loader,
}
