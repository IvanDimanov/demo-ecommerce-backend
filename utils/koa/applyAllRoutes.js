const fs = require('fs')
const path = require('path')

/**
 * Loads recursively all JS modules from the `routesPath` and applies them to the koa `app`
 *
 * @memberof koa
 * @param {object} app Instance of `new Koa()`
 * @param {string} routesPath Folder that host all BackEnd API routes
 */
const applyAllRoutes = async (app, routesPath) => {
  const basePath = path.join(routesPath)
  fs.readdirSync(basePath, { withFileTypes: true }).forEach((itemPath) => {
    const { name } = itemPath
    /* Ignore test files and folders */
    if (name === 'test' || name.includes('.spec.')) {
      return
    }

    /* If the item is a Folder it will recursively load all insides */
    const routePath = path.join(basePath, name)
    if (itemPath.isDirectory()) {
      applyAllRoutes(app, routePath)
    } else {
      const router = require(routePath)

      app.use(router.routes()).use(router.allowedMethods())
    }
  })
}

module.exports = applyAllRoutes
