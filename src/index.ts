import fastifyModule, { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'

import pluginFastifyEnv, { envVarSchema, envConfigKey } from 'plugins/fastifyEnv'
import pluginFastifyHelmet from 'plugins/fastifyHelmet'
import pluginFastifyCors from 'plugins/fastifyCors'
import pluginJson5 from 'plugins/json5'
import pluginFastifySwagger from 'plugins/fastifySwagger'
import pluginDatabase from 'plugins/database'

import preValidationSelectorHook from 'hooks/preValidationSelectorHook'

import addAllRoutes from 'utils/addAllRoutes'

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

    addAllRoutes(fastify)

    const { PORT } = (fastify as unknown as { [envConfigKey]: FromSchema<typeof envVarSchema> })[envConfigKey]
    await fastify.listen(PORT)
  } catch (error) {
    process.stderr.write(error.stack)
    process.exit(1)
  }
}

start()
