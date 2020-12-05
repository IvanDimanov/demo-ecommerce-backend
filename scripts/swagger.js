const fs = require('fs-extra')
const swaggerSpec = require('../static/swagger.spec.json')

const paths = {
  './node_modules/swagger-ui-dist/': './dist/api/',
  './static/swagger.spec.json': './dist/api/swagger.spec.json',
}

const INDEX_DEFAULT_PATH = './dist/api/index.html'
const INDEX_TEMPLATE_DEFAULT_PATH = './static/swagger.template.html'
const SPEC_TEMPLATE_PLACEHOLDER = '<-- This is where the Swagger JSON will be placed -->';

(async () => {
  Object.keys(paths).map((srcPath) => {
    fs.copySync(srcPath, paths[srcPath], {
      overwrite: true,
    })

    console.log(`${srcPath} was copied to destination: ${paths[srcPath]}`)
  })

  const templateContent = fs.readFileSync(INDEX_TEMPLATE_DEFAULT_PATH, 'utf-8')
  const specContent = templateContent.replace(SPEC_TEMPLATE_PLACEHOLDER, JSON.stringify(swaggerSpec, undefined, 2))

  fs.writeFileSync(INDEX_DEFAULT_PATH, specContent, 'utf-8')
  console.log(`${INDEX_DEFAULT_PATH} swagger-ui was successfully created`)
})()


const JS_BUNDLE_DEFAULT_PATH = './dist/api/swagger-ui-bundle.js'
const JS_BUNDLE_TEMPLATE_PLACEHOLDER = 'e.responseInterceptor=_;var M=u()();'
const CODE_TEMPLATE = `

/**
 * Converts JSON query params to string params
 * {"params.filters": [{"key":1}]}  =>  {"params.filters": ['{"key":1}']}
 */
e.parameters = Object.keys(e.parameters)
    .map((key) => ([key, e.parameters[key]]))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        value = value.map((value) => {
          if (value && (typeof value === 'object')) {
            let newValue = value
            try {
              newValue = JSON.stringify(value)
            } catch (error) {
              newValue = value
            }

            return newValue
          }
          return value
        })
      }

      return [key, value]
    })
    .reduce((params, [key, value]) => ({
      ...params,
      [key]: value,
    }), {});

`

;(async () => {
  const templateContent = fs.readFileSync(JS_BUNDLE_DEFAULT_PATH, 'utf-8')
  const bundleContent = templateContent.replace(JS_BUNDLE_TEMPLATE_PLACEHOLDER, JS_BUNDLE_TEMPLATE_PLACEHOLDER + CODE_TEMPLATE)

  fs.writeFileSync(JS_BUNDLE_DEFAULT_PATH, bundleContent, 'utf-8')
  console.log(`${JS_BUNDLE_DEFAULT_PATH} was successfully overwritten`)
})()


const JSON_PARSE_REG_EXP = /JSON\.parse/g
const JSON5_PARSE_TEMPLATE_PLACEHOLDER = 'JSON5.parse'

;(async () => {
  const templateContent = fs.readFileSync(JS_BUNDLE_DEFAULT_PATH, 'utf-8')
  const bundleContent = templateContent.replace(JSON_PARSE_REG_EXP, JSON5_PARSE_TEMPLATE_PLACEHOLDER)

  fs.writeFileSync(JS_BUNDLE_DEFAULT_PATH, bundleContent, 'utf-8')
  console.log(`${JS_BUNDLE_DEFAULT_PATH} was successfully overwritten`)
})()
