/**
 * Will try to convert a JSON into string or return '' empty string but never throw
 *
 * @memberof utils
 * @param {object} [data={}] Input that we'll try to convert to string
 * @returns {string} Either a successful result of `JSON.stringify()` or empty string ''
 */
const jsonSafeStringify = (data = {}) => {
  try {
    return JSON.stringify(data)
  } catch (error) {
    return ''
  }
}

module.exports = jsonSafeStringify
