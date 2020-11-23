const sinon = require('sinon')

const { getFirstRouteParams, beforeEachSetup, koaRouterRunner } = require('../../../../utils/testing')
const router = require('../findAndCountAll')
const { apiMethod, apiPath } = getFirstRouteParams(router)


describe(`${apiMethod} ${apiPath}`, () => {
  let layer
  let ctx
  let user


  beforeEach(() => {
    const setup = beforeEachSetup(router)
    layer = setup.layer
    ctx = setup.ctx

    user = {
      id: 'd628c599-6282-4e35-b05b-4a6990e678fa',
      name: 'John Smith',
      email: 'john@smith.com',
      status: 'active',
      hashedPassword: '$argon2i$v=19$m=4096,t=3,p=1$e11PTDcTo+38dPL5QkNDYw$uVU+YbfAsp6PWQWAEKuDkj/u5PtULEEQAWFvreJwkDg',
      createdAt: '2020-01-01T00:00:00.000Z',
      deletedAt: null,
    }

    const userFindAndCountAll = sinon.stub().returns(Promise.resolve({
      count: 1,
      rows: [user],
    }))


    ctx.database.models.user = {
      findAndCountAll: userFindAndCountAll,
    }
  })


  it('should work as expected with test data', async () => {
    await koaRouterRunner(layer.stack, ctx)

    expect(ctx.body).to.deep.equal({
      count: 1,
      rows: [user],
    })
  })
})
