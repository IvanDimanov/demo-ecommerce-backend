import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'

export enum RoleCodeEnum {
  admin,
  seller,
}

const RoleCodeEnumKeys = Object.keys(RoleCodeEnum)
  .filter((key) => Number.isNaN(Number(key)))


export const schema = {
  description: `\`RoleModel\` is a list of all available User roles, such as "admin" and "seller".
    Specific "store" roles (such as "owner", "manager") are arranged in \`StoreRoleModel\`.`,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Role ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    name: {
      type: 'string',
      description: 'Short UI description of the role',
      example: 'Admin',
    },
    code: {
      type: 'string',
      enum: RoleCodeEnumKeys,
      description: 'Unique enumeration of the role used in the programming code',
      example: RoleCodeEnumKeys[0],
    },
    description: {
      type: 'string',
      description: 'Long UI description of the role',
      example: 'User that maintains all stores in the system',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface RoleModel extends FromSchema<typeof schema> {}

/**
 * Role Model
 */
class RoleModel extends BaseModel {
  static tableName = 'role'

  static relationMappings = {
    users: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'User',
      join: {
        from: 'role.id',
        through: {
          from: 'userToRole.roleId',
          to: 'userToRole.userId',
        },
        to: 'user.id',
      },
    },
  }
}


export default RoleModel
