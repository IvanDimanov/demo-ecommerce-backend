const fs = require('fs-extra')
const readJson = require('read-package-json')

readJson('package.json', console.error, false, async (error, module) => {
  if (error) {
    console.error('There was an error reading the module')
    return
  }

  console.info('the package name is', module.name)
  console.info('the package version is', module.version)

  const srcPath = `./dist/${module.name}`
  const srcPathFull = `${srcPath}/${module.version}`
  const destPath = './dist'

  try {
    await fs.pathExists(srcPath)
    await fs.copy(srcPathFull, destPath, {
      overwrite: true,
    })
    await fs.remove(srcPath)
    console.log(`${srcPath} was moved to ${destPath}`)
  } catch (e) {
    console.warn(`${srcPath} doesn't exist, please do:`)
    console.warn('npm run build')
  }
})
