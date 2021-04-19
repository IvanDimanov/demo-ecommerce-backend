import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import ProductModel, { schema as productSchema } from 'database/models/Product'
import { schema as storeSchema } from 'database/models/Store'
import { schema as vendorSchema } from 'database/models/Vendor'
import { schema as categorySchema } from 'database/models/Category'

import generateSelectorQuery, { JoinOperationEnum } from 'utils/generateSelectorQuery'
import joinOperationSchema from 'utils/jsonSchemas/joinOperationSchema'


const allowGraph = '[stores, vendor, categories]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const paramsSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        description: 'Product UUIDv4',
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

          Product with Vendor => name, price [vendor({ select: "name" })]
          Products with Store and Category => name, [stores, categories]
        `,
        default: 'name, price',
      },
      joinOperation: joinOperationSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get Product by ID',
      description: 'Return a single Product by UUIDv4',
      tags: ['Store'],

      params: paramsSchema,
      querystring: querystringSchema,

      response: {
        200: {
          /* Relates to `allowGraph` */
          ...productSchema,
          properties: {
            ...productSchema.properties,
            stores: {
              type: 'array',
              items: {
                type: 'object',
                properties: storeSchema.properties,
              },
            },
            vendor: {
              type: 'object',
              properties: vendorSchema.properties,
            },
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: categorySchema.properties,
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
    '/api/products/:id',
    routeOptions,
    async ({ query, params }) => generateSelectorQuery(
      ProductModel,
      query.selector,
      query.joinOperation as JoinOperationEnum,
    )
    .allowGraph(allowGraph)
    .findById(params.id)
  )

  return fastify
}
