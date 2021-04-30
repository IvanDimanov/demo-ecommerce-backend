import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import OrderModel, { schema as orderSchema } from '@src/database/models/Order'
import { schema as addressSchema } from '@src/database/models/Address'
import { schema as orderItemSchema } from '@src/database/models/OrderItem'
import { schema as productSchema } from '@src/database/models/Product'

import generateSelectorQuery, { JoinOperationEnum } from '@src/utils/generateSelectorQuery'
import joinOperationSchema from '@src/utils/jsonSchemas/joinOperationSchema'


const allowGraph = '[shippingAddress, orderItems.[product]]'

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

          Order with bought Items + Product => customerEmail, status, price, [orderItems[product({ select: 'name' })]]
          Order with Address => customerEmail, status, price, [shippingAddress({ select: 'city, state' })]
        `,
        default: 'customerEmail, status, price',
      },
      joinOperation: joinOperationSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get Order by ID',
      description: 'Return a single Order by UUIDv4',
      tags: ['Order'],

      params: paramsSchema,
      querystring: querystringSchema,

      response: {
        200: {
          /* Relates to `allowGraph` */
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
  }


  fastify.get<{
    Params: FromSchema<typeof paramsSchema>,
    Querystring: FromSchema<typeof querystringSchema>,
  }>(
    '/api/orders/:id',
    routeOptions,
    async ({ query, params }) => generateSelectorQuery(
      OrderModel,
      query.selector,
      query.joinOperation as JoinOperationEnum,
    )
    .allowGraph(allowGraph)
    .findById(params.id)
  )

  return fastify
}
