import { FastifyInstance } from 'fastify'

const setErrorHandler = (fastify: FastifyInstance): void => {
  fastify.setErrorHandler(async (error, request, reply) => {
    if (error.message.endsWith(' does not exist')) {
      error.message = error.message.substr(error.message.indexOf(' - column ') + 3)
    }

    reply.send(error)
  })
}


export default setErrorHandler
