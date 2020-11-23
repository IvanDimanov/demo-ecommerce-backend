const fs = require('fs');

(async () => {
  const pathsToDelete = ['./dist', '.nyc_output'].filter((deletePath) => fs.existsSync(deletePath))

  if (pathsToDelete.length) {
    pathsToDelete.forEach((path) => fs.rmdirSync(path, { recursive: true }))
    console.log(`Deleted folders:\n- ${pathsToDelete.join('\n- ')}`)
  } else {
    console.log(`No temporary folders delete, nothing changed`)
  }
})()
