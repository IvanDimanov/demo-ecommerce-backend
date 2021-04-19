import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import StoreModel, { schema as storeSchema } from 'database/models/Store'
import { schema as userSchema } from 'database/models/User'
import { schema as productSchema } from 'database/models/Product'
import { schema as vendorSchema } from 'database/models/Vendor'

import generateSelectorQuery, { JoinOperationEnum } from 'utils/generateSelectorQuery'
import joinOperationSchema from 'utils/jsonSchemas/joinOperationSchema'
import whereRulesSchema from 'utils/jsonSchemas/whereRulesSchema'
import orderBySchema from 'utils/jsonSchemas/orderBySchema'
import pageSchema from 'utils/jsonSchemas/pageSchema'
import totalResultsSchema from 'utils/jsonSchemas/totalResultsSchema'


const allowGraph = '[users, products.[vendor]]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const querystringSchema = {
    type: 'object',
    properties: {
      selector: {
        type: 'string',
        description: `\`allowGraph\` = ${allowGraph}

          Store with related Users => name, [users({ select: "name, email, status" })]
          Store with Products and Vendors => name, [products[vendor]]
        `,
        default: 'name, description',
      },

      joinOperation: joinOperationSchema,
      whereRules: {
        ...whereRulesSchema,
        description: `
          Filter Store with their User Owners => {
            "where": [{ "column": "storeRoleCode", "operation": "=", "value": "sellerOwner" }]
          }
        `,
      },
      orderBy: orderBySchema,
      page: pageSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get all Stores',
      description: 'Return a list of Stores',
      tags: ['Store'],

      querystring: querystringSchema,

      response: {
        200: {
          total: totalResultsSchema,
          /* Relates to `allowGraph` */
          results: {
            type: 'array',
            items: {
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
      },
    },
  }


  fastify.get<{
    Querystring: FromSchema<typeof querystringSchema>,
  }>(
    '/api/stores',
    routeOptions,
    async ({ query }) => generateSelectorQuery(
      StoreModel,
      query.selector,
      query.joinOperation as JoinOperationEnum,
      query.whereRules,
      query.orderBy,
    )
    .allowGraph(allowGraph)
    .page(
      query.page?.pageIndex || querystringSchema.properties.page.properties.pageIndex.default,
      query.page?.pageSize || querystringSchema.properties.page.properties.pageSize.default,
    )
  )

  return fastify
}
