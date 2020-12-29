const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   VendorModel:
 *     description: |
 *       `VendorModel` is a list of all product producers.
 *     allOf:
 *     - type: object
 *       required:
 *       - id
 *       - name
 *       - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique vendor ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         name:
 *           type: string
 *           description: Short UI description of the vendor
 *           example: Cross
 *         description:
 *           type: string
 *           description: Long UI description of the vendor
 *           example: Cross LTD is a Bulgarian Company established in 1995 specialized in bicycle manufacturing.
 */
const VendorModel = sequelize.define('vendor', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  paranoid: false,
})


VendorModel.associate = ({ product }) => {
  VendorModel.hasMany(product, {
    as: 'products',
    sourceKey: 'id',
    foreignKey: 'vendorId',
  })
}


module.exports = VendorModel