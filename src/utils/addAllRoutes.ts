import fs from 'fs'
import path from 'path'
import { FastifyInstance } from 'fastify'

/**
 * Loads recursively all fastify API routes into the `fastify` server instance
 *
 * @param {FastifyInstance} fastify Instance of fastify server
 * @param {string} folderPath Folder we'll use to recursively start looking for fastify routes
 */
const addAllRoutes = (fastify: FastifyInstance, folderPath?: string): void => {
  const basePath = folderPath || path.join(__dirname, '../routes')

  fs.readdirSync(basePath, { withFileTypes: true }).forEach((itemPath) => {
    const { name } = itemPath
    /* Ignore test files and folders */
    if (name === 'test' || name.includes('.spec.')) {
      return
    }

    const routePath = path.join(basePath, name)
    if (itemPath.isDirectory()) {
      addAllRoutes(fastify, routePath)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const route = require(routePath)

      if (typeof route.addRoute === 'function') {
        route.addRoute(fastify)
      }
    }
  })
}


export default addAllRoutes
