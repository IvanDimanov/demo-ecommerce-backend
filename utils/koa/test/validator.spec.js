const sinon = require('sinon')
const Joi = require('@hapi/joi')
const validator = require('../validator')
const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(500).required(),
})

describe('/koa/validator', async () => {
  context('ctx.request.body', () => {
    it('should throw when there`s no request body but same need validation', async () => {
      const ctx = {}
      const next = () => {}

      let thrownError
      try {
        await validator.body(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.an.instanceof(Error)
      expect(thrownError.status).to.equal(400)
      expect(thrownError.code).to.equal('BODY_VALIDATION_ERROR')
    })


    it('should throw when request body do not meet validation #1', async () => {
      const ctx = {
        request: {
          body: {},
        },
      }
      const next = () => {}

      let thrownError
      try {
        await validator.body(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.an.instanceof(Error)
      expect(thrownError.status).to.equal(400)
      expect(thrownError.code).to.equal('BODY_VALIDATION_ERROR')
    })


    it('should throw when request body do not meet validation #2', async () => {
      const ctx = {
        request: {
          body: {
            email: '',
          },
        },
      }
      const next = () => {}

      let thrownError
      try {
        await validator.body(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.an.instanceof(Error)
      expect(thrownError.status).to.equal(400)
      expect(thrownError.code).to.equal('BODY_VALIDATION_ERROR')
    })


    it('should throw when request body do not meet validation #3', async () => {
      const ctx = {
        request: {
          body: {
            email: '',
            password: '',
          },
        },
      }
      const next = () => {}

      let thrownError
      try {
        await validator.body(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.an.instanceof(Error)
      expect(thrownError.status).to.equal(400)
      expect(thrownError.code).to.equal('BODY_VALIDATION_ERROR')
    })


    it('should throw when request body do not meet validation #4', async () => {
      const ctx = {
        request: {
          body: {
            email: 'test@test.com',
            password: 'a',
          },
        },
      }
      const next = () => {}

      let thrownError
      try {
        await validator.body(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.an.instanceof(Error)
      expect(thrownError.status).to.equal(400)
      expect(thrownError.code).to.equal('BODY_VALIDATION_ERROR')
    })


    it('should not throw when request body do meet validation', async () => {
      const ctx = {
        request: {
          body: {
            email: 'test@test.com',
            password: 'P4sSW0rD',
          },
        },
      }
      const next = sinon.spy()

      let thrownError
      try {
        await validator.body(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.undefined
      expect(next.calledOnce).to.be.true
    })
  })


  context('ctx.params', () => {
    it('should not throw when params do meet validation', async () => {
      const ctx = {
        params: {
          email: 'test@test.com',
          password: 'P4sSW0rD',
        },
      }
      const next = sinon.spy()

      let thrownError
      try {
        await validator.params(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.undefined
      expect(next.calledOnce).to.be.true
    })


    it('should not throw when params do meet validation', async () => {
      const ctx = {
        params: {
          email: 'test@test.com',
          password: 'P4sSW0rD',
        },
        originalParams: {
          email: 'test@test.com',
          password: 'P4sSW0rD',
          password2: 'P4sSW0rD',
        },
      }
      const next = sinon.spy()

      let thrownError
      try {
        await validator.params(schema)(ctx, next)
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).to.be.undefined
      expect(next.calledOnce).to.be.true
    })
  })
})
