import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import UserModel, { schema as userSchema } from 'database/models/User'
import { schema as storeSchema } from 'database/models/Store'
import { schema as roleSchema } from 'database/models/Role'

import generateSelectorQuery, { JoinOperationEnum } from 'utils/generateSelectorQuery'
import joinOperationSchema from 'utils/jsonSchemas/joinOperationSchema'


const allowGraph = '[roles, stores]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const paramsSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        description: 'User UUIDv4',
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

          User with Role and Store => name, [roles, stores({ select: "name" })]
        `,
        default: 'name, email',
      },
      joinOperation: joinOperationSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get User by ID',
      description: 'Return a single User by UUIDv4',
      tags: ['User'],

      params: paramsSchema,
      querystring: querystringSchema,

      response: {
        200: {
          /* Relates to `allowGraph` */
          ...userSchema,
          properties: {
            ...userSchema.properties,
            roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: roleSchema.properties,
              },
            },
            stores: {
              type: 'array',
              items: {
                type: 'object',
                properties: storeSchema.properties,
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
    '/api/users/:id',
    routeOptions,
    async ({ query, params }) => generateSelectorQuery(
      UserModel,
      query.selector,
      query.joinOperation as JoinOperationEnum,
    )
    .allowGraph(allowGraph)
    .findById(params.id)
  )

  return fastify
}
