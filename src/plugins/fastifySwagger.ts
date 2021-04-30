import fs from 'fs'
import path from 'path'
import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifySwagger from 'fastify-swagger'

import { FromSchema } from 'json-schema-to-ts'
import { envVarSchema, envConfigKey } from '@src/plugins/fastifyEnv'


const dbModelsAndSchemas = {}

const basePath = path.join(__dirname, '../database/models')
fs.readdirSync(basePath, { withFileTypes: true }).forEach((itemPath) => {
  const { name } = itemPath
  /* Ignore test files and folders */
  if (name === 'test' || name.includes('.spec.')) {
    return
  }

  const dbModelPath = path.join(basePath, name)
  if (!itemPath.isDirectory()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dbModel = require(dbModelPath)
    const name = dbModel.default.name
    const schema = dbModel.schema

    if (name && schema) {
      dbModelsAndSchemas[name] = schema
    }
  }
})


const plugin = fastifyPlugin(async (
  fastify: FastifyInstance,
  options,
  done: () => void,
) => {
  const {
    ENABLE_SWAGGER,
    SWAGGER_HOST,
    SWAGGER_DEFAULT_SCHEME,
  } = (fastify as unknown as { [envConfigKey]: FromSchema<typeof envVarSchema> })[envConfigKey]

  if (ENABLE_SWAGGER) {
    await fastify.register(
      fastifySwagger,
      {
        exposeRoute: true,
        routePrefix: '/swagger',
        swagger: {
          info: {
            title: 'Demo eCommerce BackEnd',
            description: 'Testing fastify APIs using the predefined validation rules.',
            version: '2.0.0',
          },
          externalDocs: {
            url: 'https://github.com/IvanDimanov/demo-ecommerce-backend',
            description: 'Find more info here',
          },
          host: SWAGGER_HOST,
          schemes: SWAGGER_DEFAULT_SCHEME === 'HTTP' ? ['HTTP', 'HTTPS'] : ['HTTPS', 'HTTP'],
          consumes: ['application/json5', 'application/json'],
          produces: ['application/json'],
          tags: [
            {
              name: 'Status',
              description: `APIs used to check server health, connection, and availability`,
            },
            {
              name: 'User',
              description: `APIs related to User Roles, DataAccess, and Profile props`,
            },
            {
              name: 'Store',
              description: `APIs related to Stores, Products, Vendors, and Product Categories`,
            },
            {
              name: 'Order',
              description: `APIs related to Orders, Order Items, Shipping Address`,
            },
          ],
          definitions: dbModelsAndSchemas,
        },
      },
    )
  }

  done()
})


export default plugin
