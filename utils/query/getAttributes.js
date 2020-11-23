const getAttributes = (select) => {
  if (!select || !Object.keys(select).length) {
    return undefined
  }

  const attributes = Object.keys(select)
    .filter((key) => select[key] === '')

  return attributes.length
    ? attributes
    : ['*']
}

module.exports = getAttributes
