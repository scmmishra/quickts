import basePackage from '../constants/package'
import { PackageJson } from 'type-fest'
import * as fs from 'fs-extra'
import path from 'path'
import { writePrettyJson } from '../utils/files'

export type ProjectOpts = {
  author: string
  email: string
  extraFeatures: string[]
  license: string
  pkg: string
  projectPath: string
  version: string
}

export default async function create(opts: ProjectOpts) {
  const { pkg, projectPath } = opts

  const packageJson = composePackageJson(opts)
  const sizeLimit = composeSizeLimit(pkg)
  const prettier = composePrettier()

  fs.ensureDir(projectPath).then(async () => {
    // Add config files
    await writePrettyJson(projectPath, 'package.json', packageJson as Record<string, unknown>)
    await writePrettyJson(projectPath, '.size-limit.json', sizeLimit as Record<string, unknown>[])
    await writePrettyJson(projectPath, '.prettier.json', prettier)
  })
}

function composePackageJson({ pkg, version, author, email, license }: ProjectOpts): PackageJson {
  return {
    name: pkg,
    version,
    author: {
      name: author,
      email: email
    },
    license,
    module: `dist/${pkg}.esm.js`,
    ...basePackage
  }
}

export function composeSizeLimit(name: string): Record<string, string>[] {
  return [
    {
      path: `dist/${name}.cjs.production.min.js`,
      limit: '10 KB'
    },
    {
      path: `dist/${name}.esm.js`,
      limit: '10 KB'
    }
  ]
}

export function composePrettier(): Record<string, unknown> {
  return {
    printWidth: 80,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5'
  }
}
