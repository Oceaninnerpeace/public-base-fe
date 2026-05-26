import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const backup = resolve(root, 'package.json.dev-backup')
const pkgPath = resolve(root, 'package.json')

if (existsSync(backup)) {
  writeFileSync(pkgPath, readFileSync(backup, 'utf8'), 'utf8')
  unlinkSync(backup)
  console.info('[public-components] restored dev exports')
}
