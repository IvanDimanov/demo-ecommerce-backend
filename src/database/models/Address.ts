import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'

export const schema = {
  description: '`AddressModel` is a general location description that can be related to a product, order, or other object.',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Address ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    addressLine1: {
      type: 'string',
      minLength: 0,
      maxLength: 320,
      description: 'General street identification',
      example: '9th ave',
    },
    addressLine2: {
      type: 'string',
      minLength: 0,
      maxLength: 320,
      description: 'Specific street identification, like street number',
      example: '10a',
    },
    city: {
      type: 'string',
      minLength: 2,
      maxLength: 320,
      description: 'City name',
      example: 'New York',
    },
    state: {
      type: 'string',
      minLength: 2,
      maxLength: 320,
      description: 'State or province name',
      example: 'New York',
    },
    country: {
      type: 'string',
      minLength: 2,
      maxLength: 320,
      description: 'Country name',
      example: 'USA',
    },
    postalCode: {
      type: 'string',
      minLength: 2,
      maxLength: 320,
      description: 'Postal or ZIP code',
      example: '12000',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that address was created',
      example: '2020-04-30T00:00:00.000Z',
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that address was marked as deleted',
      example: '2021-04-30T00:00:00.000Z',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface AddressModel extends FromSchema<typeof schema> {}

/**
 * Address Model
 */
class AddressModel extends BaseModel {
  static tableName = 'address'

  static relationMappings = {
    product: {
      relation: BaseModel.HasOneRelation,
      modelClass: 'Product',
      join: {
        from: 'address.id',
        to: 'product.originAddressId',
      },
    },

    order: {
      relation: BaseModel.HasOneRelation,
      modelClass: 'Order',
      join: {
        from: 'address.id',
        to: 'order.shippingAddressId',
      },
    },
  }

  /**
   * Enable the soft-delete for this model.
   * More info:
   *   https://github.com/ackerdev/objection-softdelete#enable-soft-delete-for-a-model
   */
  static get softDelete(): true {
    return true
  }
}


export default AddressModel
