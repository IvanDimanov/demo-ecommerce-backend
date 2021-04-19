import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'

export enum UserStatusEnum {
  pendingValidation,
  active,
  blocked,
}

const UserStatusEnumKeys = Object.keys(UserStatusEnum)
  .filter((key) => Number.isNaN(Number(key)))


export const schema = {
  description: `User can be the administrator that oversee trade.
    User can also manage stores.`,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique User ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    name: {
      type: 'string',
      description: 'User name',
      example: 'John Smith',
    },
    email: {
      type: 'string',
      description: 'User email',
      example: 'john@smith.com',
    },
    hashedPassword: {
      type: 'string',
      description: 'User password after hashing',
      example: '$argon2i$v=19$m=4096,t=3,p=1$e11PTDcTo+38dPL5QkNDYw$uVU+YbfAsp6PWQWAEKuDkj/u5PtULEEQAWFvreJwkDg',
    },
    status: {
      type: 'string',
      enum: UserStatusEnumKeys,
      description: 'Shows if the current User is `active` or not',
      example: UserStatusEnumKeys[0],
    },
    storeRoleCode: {
      type: 'string',
      description: 'How is this user related to a specific store. This prop will be available only when called in graph.',
      example: 'sellerOwner',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that user was created',
      example: '2020-04-30T00:00:00.000Z',
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that user was marked as deleted',
      example: '2021-04-30T00:00:00.000Z',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface UserModel extends FromSchema<typeof schema> {}

/**
 * User Model
 */
class UserModel extends BaseModel {
  static tableName = 'user'

  static relationMappings = {
    roles: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Role',
      join: {
        from: 'user.id',
        through: {
          from: 'userToRole.userId',
          to: 'userToRole.roleId',
        },
        to: 'role.id',
      },
    },

    storeRoles: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'StoreRole',
      join: {
        from: 'user.id',
        through: {
          from: 'userStoreRole.userId',
          to: 'userStoreRole.storeRoleId',
        },
        to: 'storeRole.id',
      },
    },

    stores: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Store',
      join: {
        from: 'user.id',
        through: {
          from: 'userStoreRole.userId',
          to: 'userStoreRole.storeId',
          extra: ['storeRoleCode'],
        },
        to: 'store.id',
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


export default UserModel
