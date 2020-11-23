const Joi = require('@hapi/joi')

const IDSchema = Joi.object()
    .keys({
      id: Joi.number().integer().min(1).required(),
    })

module.exports = IDSchema
