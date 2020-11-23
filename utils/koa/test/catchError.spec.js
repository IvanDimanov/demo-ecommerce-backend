const sinon = require('sinon')
const catchError = require('../catchError')

describe('/koa/catchError()', () => {
  it('should return a {Function}', () => {
    expect(catchError()).to.be.a('function')
  })

  it('should call `next()`', async () => {
    const emit = sinon.spy()
    const next = sinon.spy()
    const ctx = { app: { emit } }

    await catchError()(ctx, next)

    expect(next.calledOnce).to.equal(true)
  })

  it('should not throw even if `next()` throws', async () => {
    const emit = sinon.spy()
    const next = sinon.stub().throws()
    const ctx = { app: { emit } }

    expect(() => catchError()(ctx, next)).to.not.throw()
    expect(next.calledOnce).to.equal(true)
  })

  it('should try to set more relevant database error code during development', async () => {
    const error = new Error('Test')
    error.name = 'SequelizeDatabaseError'
    const emit = sinon.spy()
    const next = sinon.stub().throws(error)
    const ctx = { app: { emit } }
    process.env.DB_LOGGING = true

    expect(() => catchError()(ctx, next)).to.not.throw()
    expect(/^SequelizeDatabaseError.*/.test(error.message)).to.equal(true)
    process.env.NODE_ENV = 'test'
  })

  it('should emit the error to the app when `next()` throws', async () => {
    const error = new Error('Test')
    const emit = sinon.spy()
    const next = sinon.stub().throws(error)
    const ctx = { app: { emit } }

    expect(() => catchError()(ctx, next)).to.not.throw()
    expect(emit.calledOnceWithExactly('error', error, ctx)).to.equal(true)
  })
})
