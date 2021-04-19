import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import UserModel, { schema as userSchema } from 'database/models/User'
import { schema as storeSchema } from 'database/models/Store'
import { schema as roleSchema } from 'database/models/Role'

import generateSelectorQuery, { JoinOperationEnum } from 'utils/generateSelectorQuery'
import joinOperationSchema from 'utils/jsonSchemas/joinOperationSchema'
import whereRulesSchema from 'utils/jsonSchemas/whereRulesSchema'
import orderBySchema from 'utils/jsonSchemas/orderBySchema'
import pageSchema from 'utils/jsonSchemas/pageSchema'
import totalResultsSchema from 'utils/jsonSchemas/totalResultsSchema'


const allowGraph = '[roles, stores]'

export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
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
      whereRules: whereRulesSchema,
      orderBy: orderBySchema,
      page: pageSchema,
    },
    required: ['selector'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Get all Users',
      description: 'Return a list of Users',
      tags: ['User'],

      querystring: querystringSchema,

      response: {
        200: {
          total: totalResultsSchema,
          /* Relates to `allowGraph` */
          results: {
            type: 'array',
            items: {
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
      },
    },
  }


  fastify.get<{
    Querystring: FromSchema<typeof querystringSchema>,
  }>(
    '/api/users',
    routeOptions,
    async ({ query }) => generateSelectorQuery(
      UserModel,
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
