const Joi = require('@hapi/joi')

const path = require('path')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const config = dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})
dotenvExpand(config)


/* Be sure that the Server will run only with filtered, valid, and converted Env VARs */
const validateEnvVars = (schema) => {
  /* Make sure we do not "leak" any Server ENV VARs that are not suppose to be used by the Server */
  process.env = Object.keys(schema).reduce((map, key) => {
    map[key] = process.env[key]
    return map
  }, {})

  /* Validate the expected/filtered ENV VARs */
  const { value, error } = Joi.object().keys(schema)
      .required()
      .validate(
          process.env,
          {
            abortEarly: false,
            allowUnknown: true,
          },
      )

  /* Take the converted ENV VARs so we can have Numbers and Booleans in `process.env` */
  process.env = Object.keys(schema).reduce((map, key) => {
    map[key] = value[key]
    return map
  }, {})

  return {
    value,
    error,
  }
}

module.exports = validateEnvVars
