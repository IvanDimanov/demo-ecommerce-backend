const Joi = require('@hapi/joi')

const UserSchema = Joi.object()
    .keys({
      full_name: Joi.string().min(2).max(100).required(),
      country_code: Joi.number().integer().min(1).max(300).required(),
    })

module.exports = UserSchema
