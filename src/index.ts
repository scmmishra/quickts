#!/usr/bin/env node
import sade from 'sade'
// import ora from 'ora'

import { version } from '../package.json'
import * as fs from 'fs-extra'

import { ensureSafeProjectPath } from './utils/files'
import { licenses, optionalFeatures } from './constants/choices'

// Terminal
import { bold, dim, yellow } from 'kolorist'
import { prompt, promptMultiSelect, promptSelect } from './utils/prompts'
import fullname from 'fullname'
import create from './commands/create'
import { BuildOpts } from './types'
import watch from './esbuild/watch'
import getEmail from './utils/email'

const quickts = sade('quickts')

quickts.version(version)

quickts
  .command('create <pkg>')
  .describe('Create a TypeScript Project')
  .example('create awesome-ts-lib')
  .action(async (pkg: string) => {
    console.log(bold(yellow(`⚡️ QuickTS`)))
    console.log('')

    try {
      const realPath = await fs.realpath(process.cwd())
      const projectPath = await ensureSafeProjectPath(realPath, pkg)

      const author = await prompt(`Who is the package author?`, await fullname())
      const email = await prompt(
        `What's your email? ${dim('This will be public')}`,
        await getEmail()
      )
      const version = await prompt(`What version is this package on?`, '1.0.0')
      const extraFeatures = await promptMultiSelect('Select optional features', optionalFeatures)
      const license = await promptSelect('Select a License', licenses)

      await create({ pkg, projectPath, author, email, version, extraFeatures, license })
    } catch (e) {
      console.error(e)
    }
  })

quickts
  .command('start')
  .describe('Start watching for changes')
  .option('--entry, -i', 'Entry module', 'src/index.ts')
  .example('watch --entry src/index.ts')
  .option('--target', 'Specify your target environment', 'browser')
  .example('watch --target node')
  .option('--name', 'Specify name exposed in UMD builds')
  .example('watch --name AwesomePizzaBand')
  .option('--format', 'Specify module format(s)', 'cjs,esm')
  .example('watch --format cjs,esm')
  .action(async (watchOpts: BuildOpts) => {
    if (!watchOpts.entry) {
      watchOpts.entry = ['src/index.ts']
    } else if (typeof watchOpts.entry === 'string') {
      watchOpts.entry = [watchOpts.entry]
    }
    console.log(bold('Starting esbuild in watch mode'))
    console.log(dim(`Watching this project for changes`))
    watch(watchOpts.entry, 'dist/index.js', watchOpts.target === 'node')
  })

quickts
  .command('test')
  .describe('Run tests using Vitest')
  .option('-v, --version', 'Display the current version of Vitest')
  .option('-c, --config', 'Specify a custom config file')
  .option('-u, --update', 'Update generated snapshots')
  .option('-w --watch', 'Watch for changes and rerun tests', false)
  .option('-t --testNamePattern', 'Specify a test name pattern')
  .option('-c --coverage', 'Generate coverage reports', true)
  .action((testOptions: unknown) => {
    console.log(testOptions)
  })

quickts.parse(process.argv)
