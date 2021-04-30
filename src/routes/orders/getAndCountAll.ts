import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import OrderModel, { schema as orderSchema } from '@src/database/models/Order'
import { schema as addressSchema } from '@src/database/models/Address'
import { schema as orderItemSchema } from '@src/database/models/OrderItem'
import { schema as productSchema } from '@src/database/models/Product'

import generateSelectorQuery, { JoinOperationEnum } from '@src/utils/generateSelectorQuery'
import joinOperationSchema from '@src/utils/jsonSchemas/joinOperationSchema'
import whereRulesSchema from '@src/utils/jsonSchemas/whereRulesSchema'
import orderBySchema from '@src/utils/jsonSchemas/orderBySchema'
import pageSchema from '@src/utils/jsonSchemas/pageSchema'
import totalResultsSchema from '@src/utils/jsonSchemas/totalResultsSchema'


const allowGraph = '[shippingAddress, orderItems.[product]]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const querystringSchema = {
    type: 'object',
    properties: {
      selector: {
        type: 'string',
        description: `\`allowGraph\` = ${allowGraph}

          Order with bought Items + Product => customerEmail, status, price, [orderItems[product({ select: 'name' })]]
          Order with Address => customerEmail, status, price, [shippingAddress({ select: 'city, state' })]
        `,
        default: 'customerEmail, status, price',
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
      summary: 'Get all Orders',
      description: 'Return a list of Orders',
      tags: ['Order'],

      querystring: querystringSchema,

      response: {
        200: {
          total: totalResultsSchema,
          /* Relates to `allowGraph` */
          results: {
            type: 'array',
            items: {
              ...orderSchema,
              properties: {
                ...orderSchema.properties,
                shippingAddress: {
                  type: 'object',
                  properties: addressSchema.properties,
                },
                orderItems: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      ...orderItemSchema.properties,
                      product: {
                        type: 'object',
                        properties: productSchema.properties,
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
    '/api/orders',
    routeOptions,
    async ({ query }) => generateSelectorQuery(
      OrderModel,
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
