import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import AddressModel, { schema as addressSchema } from 'database/models/Address'
import { schema as orderSchema } from 'database/models/Order'

import generateSelectorQuery, { JoinOperationEnum } from 'utils/generateSelectorQuery'
import joinOperationSchema from 'utils/jsonSchemas/joinOperationSchema'


const allowGraph = '[order.[shippingAddress]]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const paramsSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        description: 'Address UUIDv4',
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
      
          Address with Order => city, state, [order({ select: "customerEmail" })]
        `,
        default: 'city, state',
      },
      joinOperation: joinOperationSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get Address by ID',
      description: 'Return a single Address by UUIDv4',
      tags: ['Order'],

      params: paramsSchema,
      querystring: querystringSchema,

      response: {
        200: {
          ...addressSchema,
          properties: {
            ...addressSchema.properties,
            order: {
              type: 'object',
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
  }


  fastify.get<{
    Params: FromSchema<typeof paramsSchema>,
    Querystring: FromSchema<typeof querystringSchema>,
  }>(
    '/api/addresses/:id',
    routeOptions,
    async ({ params, query }) => generateSelectorQuery(
      AddressModel,
      query.selector,
      query.joinOperation as JoinOperationEnum,
    )
    .allowGraph(allowGraph)
    .findById(params.id)
  )

  return fastify
}
