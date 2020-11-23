const Joi = require('@hapi/joi')

const UUIDv4Schema = Joi.object()
    .keys({
      id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    })

module.exports = UUIDv4Schema
