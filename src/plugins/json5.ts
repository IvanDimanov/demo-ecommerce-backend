import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import JSON5 from 'json5'


const plugin = fastifyPlugin(async (
  fastify: FastifyInstance,
  options,
  done: () => void,
) => {
  fastify.addContentTypeParser('application/json5', { parseAs: 'string' }, (request, body, done) => {
    try {
      const json = JSON5.parse(String(body))
      done(null, json)
    } catch (error) {
      error.statusCode = 400
      done(error, undefined)
    }
  })

  done()
})


export default plugin
