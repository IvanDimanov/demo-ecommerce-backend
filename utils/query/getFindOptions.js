const getAttributes = require('./getAttributes')
const getInclude = require('./getInclude')
const getWhere = require('./getWhere')
const getOrder = require('./getOrder')


const getFindOptions = ({ select = {}, parentModel }) => {
  const options = {}

  const attributes = getAttributes(select)
  if (attributes) {
    options.attributes = attributes
  }

  const include = getInclude({ select, parentModel })
  if (include) {
    options.include = include
  }

  const where = getWhere(select['$where'])
  if (where) {
    options.where = where
    options.required = 1
  }

  const order = getOrder(select['$order'])
  if (order) {
    options.order = order
  }

  const offset = select['$offset']
  if (Number.isInteger(offset)) {
    options.offset = offset
  }

  const limit = select['$limit']
  if (Number.isInteger(limit)) {
    options.limit = limit
  }

  return options
}


module.exports = getFindOptions
