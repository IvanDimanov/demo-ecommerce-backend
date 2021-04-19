import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import ProductModel, { schema as productSchema } from 'database/models/Product'
import { schema as storeSchema } from 'database/models/Store'
import { schema as vendorSchema } from 'database/models/Vendor'
import { schema as categorySchema } from 'database/models/Category'

import generateSelectorQuery, { JoinOperationEnum } from 'utils/generateSelectorQuery'
import joinOperationSchema from 'utils/jsonSchemas/joinOperationSchema'
import whereRulesSchema from 'utils/jsonSchemas/whereRulesSchema'
import orderBySchema from 'utils/jsonSchemas/orderBySchema'
import pageSchema from 'utils/jsonSchemas/pageSchema'
import totalResultsSchema from 'utils/jsonSchemas/totalResultsSchema'


const allowGraph = '[stores, vendor, categories]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
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
      whereRules: {
        ...whereRulesSchema,
        description: `
          Filter Products based on \`price\` => {
            "where": [{ "column": "price", "operation": ">", "value": 200 }]
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
      summary: 'Get all Products',
      description: 'Return a list of Products',
      tags: ['Store'],

      querystring: querystringSchema,

      response: {
        200: {
          total: totalResultsSchema,
          /* Relates to `allowGraph` */
          results: {
            type: 'array',
            items: {
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
      },
    },
  }


  fastify.get<{
    Querystring: FromSchema<typeof querystringSchema>,
  }>(
    '/api/products',
    routeOptions,
    async ({ query }) => generateSelectorQuery(
      ProductModel,
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
