const { Model } = require('objection')

/**
 * 
 */
class BaseModel extends Model {
  static modelPaths = [__dirname]
}

module.exports = BaseModel
