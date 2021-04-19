import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'

export enum StoreRoleCodeEnum {
  sellerOwner,
  sellerManager,
  sellerAdvertiser,
}

const StoreRoleCodeEnumKeys = Object.keys(StoreRoleCodeEnum)
  .filter((key) => Number.isNaN(Number(key)))


export const schema = {
  description: `\`StoreRoleModel\` which Seller user is related to which Store and as what role.
    Possible Sore roles can be "owner", "manager", etc.
    General User roles (such as "admin" and "seller") are arranged in \`RoleModel\`.`,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Store Role ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    name: {
      type: 'string',
      description: 'Short UI description of the role',
      example: 'Owner',
    },
    code: {
      type: 'string',
      enum: StoreRoleCodeEnumKeys,
      description: 'Unique enumeration of the store role used in the programming code',
      example: StoreRoleCodeEnumKeys[0],
    },
    description: {
      type: 'string',
      description: 'Long UI description of the store role',
      example: 'Seller that has full access to all of his stores',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface StoreRoleModel extends FromSchema<typeof schema> {}

/**
 * Store Role Model
 */
class StoreRoleModel extends BaseModel {
  static tableName = 'storeRole'

  static relationMappings = {
    users: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'User',
      join: {
        from: 'storeRole.id',
        through: {
          from: 'userStoreRole.storeRoleId',
          to: 'userStoreRole.userId',
        },
        to: 'user.id',
      },
    },

    stores: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Store',
      join: {
        from: 'storeRole.id',
        through: {
          from: 'userStoreRole.storeRoleId',
          to: 'userStoreRole.storeId',
        },
        to: 'store.id',
      },
    },
  }
}


export default StoreRoleModel
