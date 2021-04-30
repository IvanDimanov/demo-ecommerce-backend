import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyEnv from 'fastify-env'
import Ajv from 'ajv'

const ajv = new Ajv({
  removeAdditional: 'all',
  useDefaults: true,
  coerceTypes: true,
  nullable: true,
  allErrors: true,
})

export const envVarSchema = {
  type: 'object',
  properties: {
    PORT: {
      type: 'integer',
      minimum: 1,
      maximum: 1_000_000,
    },
    HOST: {
      type: 'string',
      oneOf: [
        { format: 'ipv4' },
        { format: 'ipv6' },
      ],
    },
    DB_URL: {
      type: 'string',
      format: 'uri',
    },
    DB_CONNECTION_POOL_MIN: {
      type: 'integer',
      min: 1,
      max: 100_000,
      default: 1,
    },
    DB_CONNECTION_POOL_MAX: {
      type: 'integer',
      min: 1,
      max: 100_000,
      default: 5,
    },
    DB_LOGGING: {
      type: 'boolean',
      default: false,
    },
    ENABLE_CORS: {
      type: 'boolean',
      default: false,
    },
    ENABLE_SWAGGER: {
      type: 'boolean',
      default: false,
    },
    SWAGGER_HOST: {
      type: 'string',
      default: 'localhost',
    },
    SWAGGER_DEFAULT_SCHEME: {
      type: 'string',
      enum: ['HTTP', 'HTTPS'],
      default: 'HTTP',
    },
  },
  required: ['PORT', 'DB_URL'],
} as const

export const envConfigKey = 'env'


const plugin = fastifyPlugin(async (
  fastify: FastifyInstance,
  options,
  done: () => void,
) => {
  await fastify
    .setValidatorCompiler(({ schema }) => ajv.compile(schema))

  await fastify.register(
    fastifyEnv,
    {
      confKey: envConfigKey,
      dotenv: true,
      schema: envVarSchema,
    },
  )

  done()
})


export default plugin
