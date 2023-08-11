#!/usr/bin/env node

/* eslint-disable no-console */
import fs from 'fs-extra'
import path from 'path'

function createThemeProject(destination) {
  const templatePath = path.join(__dirname, 'template')

  fs.copy(templatePath, destination, (err) => {
    if (err) {
      console.error('An error occurred while copying template files:', err)
    } else {
      console.log('🎉 🎉 created successfully!')
      console.log()

      console.log(`project in ${destination}`)

      console.log()

      const msg = `Done. Now run:

  ①  cd ${path.parse(projectName).name}
  ②  pnpm install
  ③  pnpm run dev`

      console.log(msg)
    }
  })
}

console.log('Creating 小小荧 project...')
console.log()

const projectName = process.argv[2] || 'my-blog'
createThemeProject(path.join(process.cwd(), projectName))
