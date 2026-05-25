import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkgPath = resolve(root, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

writeFileSync(resolve(root, 'package.json.dev-backup'), readFileSync(pkgPath, 'utf8'), 'utf8')

pkg.exports = {
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.js',
  },
}
pkg.files = ['dist', 'README.md']

writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
console.info('[public-request] exports -> dist for publish')
