import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyHelmet from 'fastify-helmet'


const plugin = fastifyPlugin(async (
  fastify: FastifyInstance,
  options,
  done: () => void,
) => {
  await fastify.register(
    fastifyHelmet,
    { contentSecurityPolicy: false },
  )

  done()
})


export default plugin
