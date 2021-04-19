import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import AddressModel, { schema as addressSchema } from 'database/models/Address'
import { schema as orderSchema } from 'database/models/Order'

import generateSelectorQuery, { JoinOperationEnum } from 'utils/generateSelectorQuery'
import joinOperationSchema from 'utils/jsonSchemas/joinOperationSchema'
import whereRulesSchema from 'utils/jsonSchemas/whereRulesSchema'
import orderBySchema from 'utils/jsonSchemas/orderBySchema'
import pageSchema from 'utils/jsonSchemas/pageSchema'
import totalResultsSchema from 'utils/jsonSchemas/totalResultsSchema'


const allowGraph = '[order.[shippingAddress]]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const querystringSchema = {
    type: 'object',
    properties: {
      selector: {
        type: 'string',
        description: `\`allowGraph\` = ${allowGraph}

          Address with Order => city, state, [order({ select: "customerEmail" })]
        `,
        default: 'city, state',
      },

      joinOperation: joinOperationSchema,
      whereRules: whereRulesSchema,
      orderBy: orderBySchema,
      page: pageSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get all Addresses',
      description: 'Return a list of Addresses',
      tags: ['Order'],

      querystring: querystringSchema,

      response: {
        200: {
          total: totalResultsSchema,
          /* Relates to `allowGraph` */
          results: {
            type: 'array',
            items: {
              ...addressSchema,
              properties: {
                ...addressSchema.properties,
                order: {
                  type: ['object', 'null'],
                  properties: {
                    ...orderSchema.properties,
                    shippingAddress: {
                      type: 'object',
                      properties: addressSchema.properties,
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
    '/api/addresses',
    routeOptions,
    async ({ query }) => generateSelectorQuery(
      AddressModel,
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
