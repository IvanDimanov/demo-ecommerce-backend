const Joi = require('@hapi/joi')

/**
 * This validation schema is used when we send params in the form of:
 *  {
 *     "select": {
 *       "full_name": "",
 *       "country": {}
 *     }
 *  }
 */
const SelectSchema = Joi.object()
    .keys({
      select: Joi.object().keys({
        '$where': Joi.object(),
        '$order': Joi.array(),
        '$offset': Joi.number().integer().min(0),
        '$limit': Joi.number().integer().min(1),
      })
          .unknown()
          .default({}),
    })

module.exports = SelectSchema
