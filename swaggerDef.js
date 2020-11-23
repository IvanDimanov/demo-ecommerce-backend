const validateEnvVars = require('./utils/validateEnvVars')
const envVarsSchema = require('./src/envVarsSchema')
const { error } = validateEnvVars(envVarsSchema)
/* istanbul ignore next: because this involves killing the test if a ENV VAR is missing or invalid */
if (error) {
  process.stderr.write(`Invalid ENV VAR:
${error.details
      .map(({ message, context }) => `  ${message}; currently ${context.key}=${context.value}`)
      .join('\n')}
\n`,
  )
  process.exit(1)
}

const nodePackage = require('./package.json')

module.exports = {
  info: {
    title: nodePackage.name,
    version: nodePackage.version,
    description: nodePackage.description,
  },
  host: process.env.SWAGGER_HOST || 'localhost:3001',
  schemes: ['http', 'https'].sort((scheme) => scheme.localeCompare(process.env.SWAGGER_DEFAULT_SCHEME)),
  basePath: '/',
  apis: ['./src/**/*.js', './database/**/*.js'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Standard Authorization header using the Bearer scheme. Example: "Bearer {token}"',
    },
  },
  security: [{
    bearerAuth: [],
  }],
}
