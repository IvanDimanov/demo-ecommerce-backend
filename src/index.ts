import fastifyModule, { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import pluginFastifyEnv, { envVarSchema, envConfigKey } from '@src/plugins/fastifyEnv'
import pluginFastifyHelmet from '@src/plugins/fastifyHelmet'
import pluginFastifyCors from '@src/plugins/fastifyCors'
import pluginJson5 from '@src/plugins/json5'
import pluginFastifySwagger from '@src/plugins/fastifySwagger'
import pluginDatabase from '@src/plugins/database'

import preValidationSelectorHook from '@src/hooks/preValidationSelectorHook'
import setErrorHandler from '@src/hooks/setErrorHandler'

import addAllRoutes from '@src/utils/addAllRoutes'

const start = async () => {
  try {
    const fastify: FastifyInstance = fastifyModule({
      logger: true,
    })

    await fastify.register(pluginFastifyEnv)
    await fastify.register(pluginFastifyHelmet)
    await fastify.register(pluginFastifyCors)
    await fastify.register(pluginJson5)
    await fastify.register(pluginFastifySwagger)
    await fastify.register(pluginDatabase)

    preValidationSelectorHook(fastify)
    setErrorHandler(fastify)

    addAllRoutes(fastify)

    const { PORT } = (fastify as unknown as { [envConfigKey]: FromSchema<typeof envVarSchema> })[envConfigKey]
    await fastify.listen(PORT)
  } catch (error) {
    process.stderr.write(error.stack)
    process.exit(1)
  }
}

start()
