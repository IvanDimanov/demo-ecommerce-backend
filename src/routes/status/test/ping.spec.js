const sinon = require('sinon')

const { getFirstRouteParams, beforeEachSetup, koaRouterRunner } = require('../../../../utils/testing')
const router = require('../ping')
const { apiMethod, apiPath } = getFirstRouteParams(router)


describe(`${apiMethod} ${apiPath}`, () => {
  let layer
  let emit
  let ctx

  beforeEach(() => {
    const setup = beforeEachSetup(router)
    layer = setup.layer
    emit = setup.emit
    ctx = setup.ctx
  })


  it('should not emit app error when user is not logged in', async () => {
    ctx.state = {}

    await koaRouterRunner(layer.stack, ctx)

    expect(emit.calledOnceWith('error')).to.equal(false)
  })


  it('should return a JSON with props "name" and "serverTime"', async () => {
    ctx.database.sequelizeInstance.authenticate = sinon.stub().returns(undefined)

    await koaRouterRunner(layer.stack, ctx)

    expect(typeof ctx.body).to.equal('object')
    expect(typeof ctx.body.name).to.equal('string')
    expect(typeof ctx.body.serverTime).to.equal('string')
    expect(ctx.body.isDbConnected).to.equal(true)
  })
})
