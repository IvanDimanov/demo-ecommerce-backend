const { Op } = require('sequelize')

const getWhere = (where) => {
  if (!where || typeof where !== 'object') {
    return where
  }

  if (Array.isArray(where)) {
    where = where.map((item) => getWhere(item, Op))
  }

  Object.keys(where).forEach((key) => {
    let updatedKey = key
    const value = where[key]

    if (key.startsWith('$')) {
      updatedKey = Op[key.replace('$', '')]
      delete where[key]
    }

    where[updatedKey] = getWhere(value, Op)
  })

  return where
}


module.exports = getWhere
