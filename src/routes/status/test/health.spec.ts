import fastifyModule from 'fastify'
import 'fastify-swagger' // Importing Swagger here so we have the correct types installed
import { expect } from 'chai'

import { addRoute as getStatusHealthRoute } from '../health'


describe('Route /api/status/health', () => {
  let fastify

  before(() => {
    fastify = fastifyModule()
  })

  after(() => {
    fastify.close()
  })


  it('Verify response types', async () => {
    fastify = getStatusHealthRoute(fastify)

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/status/health',
    })

    const body = response.json()

    expect(response.statusCode).to.equal(200)
    expect(body).to.be.an('object')
    expect(body.serverTime).to.be.a('string')
    expect(body.isDbConnected).to.be.a('boolean')
    expect(body.dbTime).to.be.a('string')
  })
})
