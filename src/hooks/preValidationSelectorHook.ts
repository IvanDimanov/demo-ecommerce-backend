import { FastifyInstance } from 'fastify'
import JSON5 from 'json5'

type SelectorQuery = {
  whereRules?: string
  orderBy?: string
  page?: string
}


const preValidationSelectorHook = (fastify: FastifyInstance) => {
  fastify.addHook('preValidation', async (request) => {
    const { whereRules, orderBy, page } = request.query as SelectorQuery

    if (whereRules && typeof whereRules == 'string') {
      try {
        (request.query as SelectorQuery).whereRules = JSON5.parse(whereRules)
      } catch (error) {
        /* Parsing error, it'll be caught by API validation */
      }
    }

    if (orderBy && typeof orderBy == 'string') {
      try {
        (request.query as SelectorQuery).orderBy = JSON5.parse(orderBy)
      } catch (error) {
        /* Parsing error, it'll be caught by API validation */
      }
    }

    if (page && typeof page == 'string') {
      try {
        (request.query as SelectorQuery).page = JSON5.parse(page)
      } catch (error) {
        /* Parsing error, it'll be caught by API validation */
      }
    }
  })
}


export default preValidationSelectorHook
