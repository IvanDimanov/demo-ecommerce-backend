/**
 * Will return a Promise that will be resolved or rejected after specific time.
 *
 * @param {number} [timeout=100] - After how many milliseconds the Promise will be resolved
 * @param {any} [response=undefined] - What will be returned as a result in the Promise resolution
 * @param {boolean} [isSuccess=true] - Will the Promise be resolved or rejected
 *
 * @returns {object} Promise that will be resolved or rejected after specific time.
 */
function delay(timeout = 100, response, isSuccess = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isSuccess) {
        return resolve(response)
      }
      return reject(response)
    }, timeout)
  })
}

module.exports = delay
