import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'


export const schema = {
  description: '`VendorModel` is a list of all product producers.',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Vendor ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    name: {
      type: 'string',
      description: 'Short UI description of the vendor',
      example: 'Cross',
    },
    description: {
      type: 'string',
      description: 'Long UI description of the vendor',
      example: 'Cross LTD is a Bulgarian Company established in 1995 specialized in bicycle manufacturing.',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface VendorModel extends FromSchema<typeof schema> {}

/**
 * Role Model
 */
class VendorModel extends BaseModel {
  static tableName = 'vendor'

  static relationMappings = {
    products: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Product',
      join: {
        from: 'vendor.id',
        to: 'product.vendorId',
      },
    },
  }
}


export default VendorModel
