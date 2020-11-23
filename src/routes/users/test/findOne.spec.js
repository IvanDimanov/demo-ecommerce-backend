const sinon = require('sinon')

const { HttpError } = require('../../../../utils/koa')
const { getFirstRouteParams, beforeEachSetup, koaRouterRunner } = require('../../../../utils/testing')
const router = require('../findOne')
const { apiMethod, apiPath } = getFirstRouteParams(router)


describe(`${apiMethod} ${apiPath}`, () => {
  let layer
  let ctx
  let user


  beforeEach(() => {
    const setup = beforeEachSetup(router)
    layer = setup.layer
    ctx = setup.ctx

    const getDateWrap = (data) => ({
      ...data,
      get: () => ({ ...data }),
    })

    user = {
      id: 'd628c599-6282-4e35-b05b-4a6990e678fa',
      name: 'John Smith',
      email: 'john@smith.com',
      status: 'active',
      hashedPassword: '$argon2i$v=19$m=4096,t=3,p=1$e11PTDcTo+38dPL5QkNDYw$uVU+YbfAsp6PWQWAEKuDkj/u5PtULEEQAWFvreJwkDg',
      createdAt: '2020-01-01T00:00:00.000Z',
      deletedAt: null,
    }

    const userFindAll = sinon.stub().returns(Promise.resolve([getDateWrap(user)]))

    ctx.params.id = user.id
    ctx.database.models.user = {
      findAll: userFindAll,
    }
  })


  context('invalid requests', () => {
    it('should throw 404 with USER_NOT_FOUND `country_code` prop is not in the DB', async () => {
      ctx.database.models.user.findAll = sinon.stub().returns(Promise.resolve([]))

      let thrownError

      try {
        await koaRouterRunner(layer.stack, ctx)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.an.instanceof(HttpError)
      expect(thrownError.status).to.equal(404)
      expect(thrownError.code).to.equal('USER_NOT_FOUND')
    })
  })


  context('valid requests', () => {
    it('should work as expected with test data', async () => {
      await koaRouterRunner(layer.stack, ctx)

      expect(ctx.body).to.deep.equal(user)
    })
  })
})
