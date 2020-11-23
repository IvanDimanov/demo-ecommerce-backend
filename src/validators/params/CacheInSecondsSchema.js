const Joi = require('@hapi/joi')

const CacheInSecondsSchema = Joi.object()
    .keys({
      cacheInSeconds: Joi.number().integer().min(0).default(10),
    })

module.exports = CacheInSecondsSchema
