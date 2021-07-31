import basePackage from '../constants/package'
import { PackageJson } from 'type-fest'
import * as fs from 'fs-extra'

import { bold, green } from 'kolorist'

import path from 'path'

import { deleteDir, deleteFile, writePretty } from '../utils/files'
import { OptionalFeatures } from '../constants/choices'
import getLicense from '../utils/license'
import ora from 'ora'
import { installing } from '../utils/messages'
import { installPackages } from '../constants/commands'

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
  console.log('')
  const bootSpinner = ora(`Initializing Project ${bold(green(pkg))}`)

  const packageJson = composePackageJson(opts)
  const sizeLimit = composeSizeLimit(pkg)
  const prettier = composePrettier()

  fs.ensureDir(projectPath).then(async () => {
    bootSpinner.start()
    // Add config files
    await fs.copy(path.resolve(__dirname, `../templates`), projectPath, { overwrite: true })

    // fix gitignore
    await fs.move(
      path.resolve(projectPath, './gitignore'),
      path.resolve(projectPath, './.gitignore')
    )

    // Fetch license from GitHub API and replace the year and name
    if (opts.license) {
      try {
        const licenseBody = await getLicense(opts.license)
        await writePretty(
          projectPath,
          'LICENSE',
          licenseBody
            .replace('[year]', `${new Date().getFullYear()}`)
            .replace('[fullname]', opts.author)
        )
      } catch {}
    }

    // Add package json
    await writePretty(projectPath, 'package.json', packageJson as Record<string, unknown>)

    // Add size limit config
    await writePretty(projectPath, '.size-limit.json', sizeLimit as Record<string, unknown>[])

    // Add size prettier config
    await writePretty(projectPath, '.prettier.json', prettier)

    // enable or disbale deepsource
    if (!opts.extraFeatures.includes(OptionalFeatures.DEEPSOURCE)) {
      await deleteFile(projectPath, '.deepsource.toml')
      await deleteFile(projectPath, ['.github', 'workflow', 'test-report.yml'])
    } else {
      await deleteFile(projectPath, ['.github', 'workflow', 'test.yml'])
    }

    // enable or disbale github actions
    if (!opts.extraFeatures.includes(OptionalFeatures.GITHUB_ACTIONS)) {
      await deleteDir(projectPath, ['.github', 'workflow'])
    }
    bootSpinner.succeed(`Created Project ${bold(green(pkg))}`)
    bootSpinner.stop()

    const deps = getDependencies(opts)
    const installSpinner = ora(installing(deps.sort())).start()

    try {
      process.chdir(projectPath)
      await installPackages(deps)
      installSpinner.succeed('Installed dependencies')
    } catch (error) {
      installSpinner.fail('Failed to install dependencies')
      console.error(error)
      process.exit(1)
    }
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

export function getDependencies({ extraFeatures }: ProjectOpts): string[] {
  const base = ['quickts', 'tslib', 'typescript', 'size-limit', '@size-limit/preset-small-lib']
  if (extraFeatures.includes(OptionalFeatures.TYPE_DOC)) {
    return [...base, 'typedoc']
  }
  return base
}
