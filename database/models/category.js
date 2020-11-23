const { DataTypes } = require('sequelize')
const { getInstance } = require('../config/sequelize-pool')
const sequelize = getInstance()

/**
 * @swagger
 * definitions:
 *   CategoryModel:
 *     description: |
 *       `CategoryModel` is a list of descriptive tags that can be assigned to a product.
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
 *           description: Unique category ID
 *           example: d628c599-6282-4e35-b05b-4a6990e678fa
 *         name:
 *           type: string
 *           description: Short UI description of the category
 *           example: Phones
 *         description:
 *           type: string
 *           description: Long UI description of the category
 *           example: Category related to phones
 */
const CategoryModel = sequelize.define('category', {
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


CategoryModel.associate = ({ product }) => {
  CategoryModel.belongsToMany(product, {
    as: 'products',
    through: 'categoryToProduct',
    foreignKey: 'categoryId',
    otherKey: 'productId',
  })
}


module.exports = CategoryModel
