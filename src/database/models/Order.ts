import BaseModel from './Base'
import { FromSchema } from 'json-schema-to-ts'

export enum OrderStatusEnum {
  draft,
  submitted,
  processing,
  shipped,
  received,
  rejected,
}

const OrderStatusEnumKeys = Object.keys(OrderStatusEnum)
  .filter((key) => Number.isNaN(Number(key)))


export const schema = {
  description: '`OrderModel` is the group of all items the Customer already bought.',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique Order ID',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    shippingAddressId: {
      type: 'string',
      format: 'uuid',
      description: 'Reference to the `AddressModel`',
      example: 'd628c599-6282-4e35-b05b-4a6990e678fa',
    },
    customerName: {
      type: 'string',
      minLength: 2,
      maxLength: 320,
      description: 'Name of the Customer',
      example: 'John Smith',
    },
    customerEmail: {
      type: 'string',
      minLength: 5,
      maxLength: 320,
      description: 'Email of the Customer',
      example: 'john@smith.com',
    },
    customerPhone: {
      type: 'string',
      minLength: 0,
      maxLength: 320,
      description: 'Phone number of the Customer',
      example: '555-1234567',
    },
    status: {
      type: 'string',
      enum: OrderStatusEnumKeys,
      description: 'Where this orders stands in term of progress toward our customer',
      example: OrderStatusEnumKeys[0],
    },
    price: {
      type: 'number',
      min: 0,
      max: 1_000_000,
      description: 'How much the total order cost the Customer, including coupons or additional shipping expenses',
      example: 199,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that order was created',
      example: '2020-04-30T00:00:00.000Z',
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
      description: 'DateTime indicating when that order was marked as deleted',
      example: '2021-04-30T00:00:00.000Z',
    },
  },
} as const

/**
 * https://dev.to/tylerlwsmith/using-a-typescript-interface-to-define-model-properties-in-objection-js-1231
 */
interface OrderModel extends FromSchema<typeof schema> {}

/**
 * Order Model
 */
class OrderModel extends BaseModel {
  static tableName = 'order'

  static relationMappings = {
    shippingAddress: {
      relation: BaseModel.HasOneRelation,
      modelClass: 'Address',
      join: {
        from: 'order.shippingAddressId',
        to: 'address.id',
      },
    },

    products: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Product',
      join: {
        from: 'order.id',
        through: {
          from: 'orderItem.orderId',
          to: 'orderItem.productId',
        },
        to: 'product.id',
      },
    },

    orderItems: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'OrderItem',
      join: {
        from: 'order.id',
        to: 'orderItem.orderId',
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


export default OrderModel
