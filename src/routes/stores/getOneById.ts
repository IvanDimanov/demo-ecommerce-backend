import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import StoreModel, { schema as storeSchema } from '@src/database/models/Store'
import { schema as userSchema } from '@src/database/models/User'
import { schema as productSchema } from '@src/database/models/Product'
import { schema as vendorSchema } from '@src/database/models/Vendor'

import generateSelectorQuery, { JoinOperationEnum } from '@src/utils/generateSelectorQuery'
import joinOperationSchema from '@src/utils/jsonSchemas/joinOperationSchema'


const allowGraph = '[users, products.[vendor]]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const paramsSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        description: 'Order UUIDv4',
      },
    },
    required: ['id'],
    additionalProperties: false,
  } as const


  const querystringSchema = {
    type: 'object',
    properties: {
      selector: {
        type: 'string',
        description: `\`allowGraph\` = ${allowGraph}

          Store with related Users => name, [user({ select: "name, email, status" })]
          Store with Products and Vendors => name, [products[vendor]]
        `,
        default: 'name, description',
      },
      joinOperation: joinOperationSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get Store by ID',
      description: 'Return a single Store by UUIDv4',
      tags: ['Store'],

      params: paramsSchema,
      querystring: querystringSchema,

      response: {
        200: {
          /* Relates to `allowGraph` */
          ...storeSchema,
          properties: {
            ...storeSchema.properties,
            users: {
              type: 'array',
              items: {
                type: 'object',
                properties: userSchema.properties,
              },
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  ...productSchema.properties,
                  vendor: {
                    type: 'object',
                    properties: vendorSchema.properties,
                  },
                },
              },
            },
          },
        },
      },
    },
  }


  fastify.get<{
    Params: FromSchema<typeof paramsSchema>,
    Querystring: FromSchema<typeof querystringSchema>,
  }>(
    '/api/stores/:id',
    routeOptions,
    async ({ query, params }) => generateSelectorQuery(
      StoreModel,
      query.selector,
      query.joinOperation as JoinOperationEnum,
    )
    .allowGraph(allowGraph)
    .findById(params.id)
  )

  return fastify
}
