const containers = {
  query: {
    storageProperty: 'originalQuery',
    joiOptions: {
      allowUnknown: false,
      abortEarly: false,
    },
  },

  // For use with koa-bodyparser
  body: {
    storageProperty: 'originalBody',
    joiOptions: {
      allowUnknown: false,
      abortEarly: false,
    },
  },

  headers: {
    storageProperty: 'originalHeaders',
    joiOptions: {
      allowUnknown: true,
      stripUnknown: false,
      abortEarly: false,
    },
  },

  // URL params e.g "/users/:userId"
  params: {
    storageProperty: 'originalParams',
    joiOptions: {
      allowUnknown: false,
      abortEarly: false,
    },
  },

  // File uploads
  files: {
    storageProperty: 'files',
    joiOptions: {
      allowUnknown: true,
      stripUnknown: false,
      abortEarly: false,
    },
  },
}

/**
 * Take all keys and values from `source` and assign them to `target`
 * so `target` will still be pointing to the same {object}
 * but will have the exact same content as `source`.
 *
 * @param {object} target The main object that will have keys added, updated, removed
 * @param {object} source The object we'll take keys and values from
 */
const copyKeys = (target = {}, source) => {
  const targetKeys = Object.keys(target)
  const sourceKeys = Object.keys(source)

  targetKeys.forEach((key) => {
    if (!sourceKeys.includes(key)) {
      delete target[key]
    }
  })

  sourceKeys.forEach((key) => {
    target[key] = source[key]
  })
}

/**
 * Make validating a koa2 request easier.
 * Using @hapi/joi to generate validation errors.
 * Based on https://github.com/Dunnodv/koa2-joi-validate#custom-koa2-error-handler
 *
 * @memberof koa
 * @returns {Function} Returns the koa2 middleware for validating a request
 *
 * @example
 * validator.body({
 *   email: Joi.string().email().required(),
 *   password: Joi.string().min(2).max(500).required(),
 * }),
 */
const validator = () => {
  const instance = {}

  Object.keys(containers).forEach((type) => {
    // e.g the "body" or "query" from above
    const container = containers[type]

    instance[type] = function(schema, options) {
      return async function Koa2JoiValidator(ctx, next) {
        const labelType = String(type).toLocaleUpperCase()
        const validatingObject = (type === 'params') ? ctx[type] : (ctx.request || {})[type]

        if (!validatingObject) {
          const validationError = new Error(`Missing request ${type}`)
          validationError.status = 400
          validationError.code = `${labelType}_VALIDATION_ERROR`

          throw validationError
        }

        const { value, error } = schema.validate(validatingObject, options || container.joiOptions)

        if (error) {
          const errorMessage = Object.keys(value)
              .reduce((message, key) => message.replace(new RegExp(`\\[ref:${key}\\]`, 'g'), value[key]), error.message)

          const validationError = new Error(errorMessage)
          validationError.status = 400
          validationError.code = `${labelType}_VALIDATION_ERROR`

          throw validationError
        } else {
          if (type === 'params') {
            copyKeys(ctx[container.storageProperty], ctx[type])
            copyKeys(ctx[type], value)
          } else {
            copyKeys(ctx.request[container.storageProperty], ctx.request[type])
            copyKeys(ctx.request[type], value)
          }

          await next()
        }
      }
    }
  })

  return instance
}

module.exports = validator()
