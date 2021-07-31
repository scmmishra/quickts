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
import consola from 'consola'
import create from './commands/create'

const quickts = sade('quickts')

quickts.version(version)

quickts
  .command('create <pkg>')
  .describe('Create a TypeScript Project')
  .example('create awesome-ts-lib')
  .action(async (pkg: string) => {
    console.log(bold(yellow(`⚡️ QuickTS`)))
    console.log('')

    // const spinner = ora(`Creating ${bold(yellow(pkg))}`);
    try {
      const realPath = await fs.realpath(process.cwd())
      const projectPath = await ensureSafeProjectPath(realPath, pkg)

      const author = await prompt(`Who is the package author?`, await fullname())
      const email = await prompt(
        `What's your email? ${dim('This will be public')}`,
        'quickts@example.com'
      )
      const version = await prompt(`What version is this package on?`, '1.0.0')
      const extraFeatures = await promptMultiSelect('Select optional features', optionalFeatures)
      const license = await promptSelect('Select a License', licenses)

      await create({ pkg, projectPath, author, email, version, extraFeatures, license })
    } catch (e) {
      consola.error(e)
    }
  })

quickts.parse(process.argv)
