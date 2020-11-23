const { getConfig } = require('../config')

describe('/db/config', () => {
  let ORIGINAL_DB_URL

  beforeEach(() => {
    ORIGINAL_DB_URL = process.env.DB_URL
  })

  afterEach(() => {
    process.env.DB_URL = ORIGINAL_DB_URL
  })

  it('should return a valid `url` property', () => {
    const config = getConfig()

    expect(config).to.be.an('object')
    expect(config.url).to.be.a('string')
    expect(config.url.startsWith('postgres://')).to.equal(true)
  })

  it('should not return a valid `url` property when there is no set Env var', () => {
    process.env.DB_URL = ''

    const config = getConfig()

    expect(config).to.be.an('object')
    expect(config.url).to.be.a('string')
    expect(config.url).to.equal('')
  })

  it('should return test `url` property when set as Env var', () => {
    const TEST_DB_URL = 'postgres://test@test:5432/test'
    process.env.DB_URL = TEST_DB_URL

    const config = getConfig()

    expect(config.url).to.equal(TEST_DB_URL)
  })

  it('should return `console.log` logging property when set as Env var', () => {
    process.env.DB_LOGGING = true

    const config = getConfig()

    expect(typeof(config.logging)).to.equal('function')
  })

  it('should return `false` logging property when set as Env var', () => {
    process.env.DB_LOGGING = false

    const config = getConfig()

    expect(config.logging).to.equal(false)
  })
})
