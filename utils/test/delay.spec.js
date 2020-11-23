const delay = require('../delay')

describe('/utils/delay', () => {
  it('should return with success by default', async () => {
    const result = await delay()

    expect(
        result
    ).to.equal(undefined)
  })


  it('should throw when requested', async () => {
    const result = await delay(100, 'test-response', false).catch((result) => console.log(result) || result)

    expect(
        result
    ).to.equal('test-response')
  })
})
