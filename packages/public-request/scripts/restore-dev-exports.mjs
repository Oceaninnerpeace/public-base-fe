import { existsSync, readFileSync, renameSync, unlinkSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const backup = resolve(root, 'package.json.dev-backup')
const pkgPath = resolve(root, 'package.json')

if (!existsSync(backup)) {
  process.exit(0)
}

readFileSync(backup, 'utf8')
unlinkSync(pkgPath)
renameSync(backup, pkgPath)
