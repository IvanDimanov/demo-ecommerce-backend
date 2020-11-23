const getModelByName = require('./getModelByName')

const getOrder = (order) => {
  if (!order || !Array.isArray(order) || !order.length) {
    return undefined
  }

  return order
  /**
   * The `$order` must be an array of arrays, such as:
   * {
   *   "$order": [
   *     [...],
   *     [...],
   *     ...
   *   ]
   * }
   */
  .filter((orderItem) => Array.isArray(orderItem))

  /**
   * Convert the single order item into more manageable list of models and order direction:
   * ["user.merchant.country.name", "asc"]
   *   =>
   * [
   *   [
   *     "user",
   *     "merchant",
   *     "country",
   *     "name"
   *   ],
   *   {
   *     "direction": "asc"
   *   }
   * ]
   */
  .map(([field, direction]) => {
    field = field.split('.')
    direction = String(direction || '').toLocaleLowerCase()

    return {
      field,
      direction,
    }
  })

  /**
   * Convert all model names from the list of fields into model descriptions:
   * [
   *   [
   *     "user",
   *     "merchant",
   *     "country",
   *     "name"
   *   ],
   *   {
   *     "direction": "asc"
   *   }
   * ]
   *
   *   =>
   *
   * [
   *   [
   *     {
   *       "model": "model.users",
   *       "as": "user"
   *     },
   *     {
   *       "model": "model.merchants",
   *       "as": "merchant"
   *     },
   *     {
   *       "model": "model.countries",
   *       "as": "country"
   *     },
   *     "name"
   *   ],
   *   {
   *     "direction": "asc"
   *   }
   * ]
   */
  .map(({ field, direction }) => {
    field = field.map((model, index) => {
      /**
       * Keep the last field item as it is
       * since all previous field items are models
       * but the last one is the DB Table column name
       */
      if (index === field.length - 1) {
        return model
      }

      return {
        model: getModelByName(model),
        as: model,
      }
    })

    return {
      field,
      direction,
    }
  })

  /**
   * Spread all props in a way Sequelize expect them
   * https://stackoverflow.com/a/45936923
   * [
   *   [
   *     {
   *       "model": "model.users",
   *       "as": "user"
   *     },
   *     {
   *       "model": "model.merchants",
   *       "as": "merchant"
   *     },
   *     {
   *       "model": "model.countries",
   *       "as": "country"
   *     },
   *     "name"
   *   ],
   *   {
   *     "direction": "asc"
   *   }
   * ]
   *
   *   =>
   *
   * [
   *   {
   *     "model": "model.users",
   *     "as": "user"
   *   },
   *   {
   *     "model": "model.merchants",
   *     "as": "merchant"
   *   },
   *   {
   *     "model": "model.countries",
   *     "as": "country"
   *   },
   *   "name",
   *   "asc"
   * ]
   */
  .map(({ field, direction }) => [
    ...field,
    direction,
  ])
}

module.exports = getOrder
