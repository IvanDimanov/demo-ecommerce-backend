const fs = require('fs-extra')

const srcPath = './static/fixtures'
const destPath = './dist/fixtures';

(async () => {
  const pathExists = await fs.pathExists(destPath)
  if (pathExists) {
    return console.warn(`${destPath} already exists, nothing changed`)
  }

  await fs.copy(srcPath, destPath)
  console.log(`${srcPath} was copied to ${destPath}`)
})()
