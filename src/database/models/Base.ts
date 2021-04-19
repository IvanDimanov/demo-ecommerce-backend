import { Model } from 'objection'

/**
 * Base Model used as extension for all DB Models
 */
class BaseModel extends Model {
  /**
   * A list of folder paths used when searching for other DB Models
   * More info:
   *   https://vincit.github.io/objection.js/api/model/static-properties.html#static-modelpaths
   */
  static modelPaths = [__dirname]
}


export default BaseModel
