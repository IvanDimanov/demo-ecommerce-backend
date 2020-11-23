const Joi = require('@hapi/joi')

module.exports = {
  NODE_ENV: Joi
      .string()
      .valid('development', 'test', 'production')
      .insensitive()
      .required(),

  PORT: Joi
      .number()
      .integer()
      .min(10)
      .max(100000)
      .required(),

  DB_DIALECT: Joi
      .string()
      .required(),

  DB_URL: Joi
      .string()
      .uri()
      .required(),

  DB_MIGRATION_STORAGE: Joi
      .string()
      .optional()
      .default('_sequelize-migrations'),

  DB_SEEDER_STORAGE: Joi
      .string()
      .optional()
      .default('_sequelize-seeds'),

  DB_CHARSET: Joi
      .string()
      .optional()
      .default('utf8'),

  DB_COLLATE: Joi
      .string()
      .optional()
      .default('utf8_general_ci'),

  DB_LOGGING: Joi
      .boolean()
      .optional(),

  DB_CONNECTION_POOL_MAX: Joi
      .number()
      .integer()
      .optional()
      .default(5),

  DB_CONNECTION_POOL_MIN: Joi
      .number()
      .integer()
      .optional()
      .default(1),

  DB_CONNECTION_POOL_IDLE: Joi
      .number()
      .integer()
      .optional()
      .default(10000),

  DB_CONNECTION_POOL_ACQUIRE: Joi
      .number()
      .integer()
      .optional()
      .default(10000),

  DB_CONNECTION_POOL_EVICT: Joi
      .number()
      .integer()
      .optional()
      .default(1000),

  ALLOW_CORS: Joi
      .boolean()
      .required(),

  SWAGGER_HOST: Joi
      .string()
      .required(),

  SWAGGER_DEFAULT_SCHEME: Joi
      .string()
      .default('HTTPS'),
}
