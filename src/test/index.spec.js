const { createApp, getPort } = require('../index')

describe('/src/app()', () => {
  let ORIGINAL_JWT_SECRET

  beforeEach(() => {
    ORIGINAL_JWT_SECRET = process.env.JWT_SECRET
  })

  afterEach(() => {
    process.env.JWT_SECRET = ORIGINAL_JWT_SECRET
  })

  it('should be an {object}', () => {
    expect(createApp()).to.be.an('object')
  })

  it('should have `.listen()` even when CORS is allowed', () => {
    process.env.ALLOW_CORS = true
    expect(createApp().listen).to.be.a('function')
  })

  it('should have `.listen()` when JWT_SECRET is set', () => {
    process.env.JWT_SECRET = 'test'
    expect(createApp().listen).to.be.a('function')
  })

  it('should have `.listen()` when JWT_SECRET is not set', () => {
    process.env.ALLOW_CORS = false
    process.env.JWT_SECRET = ''
    expect(createApp().listen).to.be.a('function')
  })

  it('should use "PORT" from ENV VAR when same is set', () => {
    process.env.PORT = 1234
    expect(getPort()).to.equal(process.env.PORT)
  })
})
