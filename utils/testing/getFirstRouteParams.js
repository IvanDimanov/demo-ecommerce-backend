/**
 * Common function to get the first router (like "GET api/v1/users") from a Koa router
 *
 * @param {object} router Koa router
 * @returns {object} Gives the first router params such as `{ apiPath, apiMethod }`
 */
const getFirstRouteParams = (router) => {
  const layer = router.stack[0]

  return {
    apiPath: layer.path,
    apiMethod: layer.methods.pop(),
  }
}


module.exports = getFirstRouteParams
