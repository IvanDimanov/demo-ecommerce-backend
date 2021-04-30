import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyCors from 'fastify-cors'

import { FromSchema } from 'json-schema-to-ts'
import { envVarSchema, envConfigKey } from '@src/plugins/fastifyEnv'


const plugin = fastifyPlugin(async (
  fastify: FastifyInstance,
  options,
  done: () => void,
) => {
  const {
    ENABLE_CORS,
  } = (fastify as unknown as { [envConfigKey]: FromSchema<typeof envVarSchema> })[envConfigKey]

  if (ENABLE_CORS) {
    await fastify.register(
      fastifyCors,
      {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        exposedHeaders: ['authorization'],
      },
    )
  }

  done()
})


export default plugin
