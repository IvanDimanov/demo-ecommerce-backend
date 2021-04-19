import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'

export const schema = {
  description: '`StoreModel` serves as presentational for all Seller products.',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Store ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    name: {
      type: 'string',
      description: 'Short UI description of the store',
      example: 'Alo-Alo',
    },
    description: {
      type: 'string',
      description: 'Long UI description of the store',
      example: 'Store dedicated on selling only phones',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that store was created',
      example: '2020-04-30T00:00:00.000Z',
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that store was marked as deleted',
      example: '2021-04-30T00:00:00.000Z',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface StoreModel extends FromSchema<typeof schema> {}

/**
 * Store Model
 */
class StoreModel extends BaseModel {
  static tableName = 'store'

  static relationMappings = {
    products: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Product',
      join: {
        from: 'store.id',
        through: {
          from: 'storeToProduct.storeId',
          to: 'storeToProduct.productId',
        },
        to: 'product.id',
      },
    },

    storeRoles: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'StoreRole',
      join: {
        from: 'store.id',
        through: {
          from: 'userStoreRole.storeId',
          to: 'userStoreRole.storeRoleId',
        },
        to: 'storeRole.id',
      },
    },

    users: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'User',
      join: {
        from: 'store.id',
        through: {
          from: 'userStoreRole.storeId',
          to: 'userStoreRole.userId',
          extra: ['storeRoleCode'],
        },
        to: 'user.id',
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


export default StoreModel
