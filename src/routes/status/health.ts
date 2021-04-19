import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { Model } from 'objection'


export const addRoute = (fastify: FastifyInstance): FastifyInstance => {
  const getStatusHealthResponseSchema = {
    type: 'object',
    properties: {
      serverTime: {
        type: 'string',
        format: 'date-time',
        description: 'Server ISO time',
        example: '2019-09-24T17:43:21.142Z',
      },
      isDbConnected: {
        type: 'boolean',
        description: 'Can server access the DB',
        example: true,
      },
      dbTime: {
        type: 'string',
        format: 'date-time',
        description: 'Database ISO time',
        example: '2019-09-24T17:43:21.142Z',
      },
    },
    required: ['serverTime', 'isDbConnected'],
    additionalProperties: false,
  } as const


  const routeOptions: RouteShorthandOptions = {
    schema: {
      summary: 'Health check',
      description: 'Common ping test to check if server is still alive and connected to DB.',
      tags: ['Status'],

      response: {
        200: getStatusHealthResponseSchema,
      },
    },
  }


  fastify.get(
    '/api/status/health',
    routeOptions,
    async (): Promise<FromSchema<typeof getStatusHealthResponseSchema>> => {
      let isDbConnected = false
      let dbTime = ''

      try {
        const { rows: [{ result }] } = await Model.knex().raw('SELECT NOW() AS result')
        dbTime = result
        isDbConnected = true
      } catch (error) {
        fastify.log.error(`Unable to ping DB: ${error.stack}`)
      }

      return {
        serverTime: new Date().toISOString(),
        isDbConnected,
        dbTime,
      }
    }
  )

  return fastify
}
