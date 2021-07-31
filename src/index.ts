#!/usr/bin/env node
import sade from 'sade'
// import ora from 'ora'

import { version } from '../package.json'
import { bold, yellow } from 'kolorist'
import * as fs from 'fs-extra'
import { ensureSafeProjectPath } from './utils/files'
import { prompt, promptMultiSelect, promptSelect } from './utils/prompts'
import { licenses, optionalFeatures } from './constants/choices'

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
      let projectPath = await ensureSafeProjectPath(realPath, pkg)

      const author = await prompt(`Who is the package author?`)
      const email = await prompt(`What's your email? (This will be public)`)
      const version = await prompt(`What version is this package on?`, '1.0.0')
      const extraFeatures = await promptMultiSelect('Select optional features', optionalFeatures)
      const license = await promptSelect('Select a License', licenses)

      console.log(author, email, version, extraFeatures, license)
    } catch {}
  })

quickts.parse(process.argv)
