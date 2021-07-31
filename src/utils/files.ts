import * as fs from 'fs-extra'
import { prompt } from './prompts'

import { bold, red } from 'kolorist'

export async function ensureSafeProjectPath(currentPath: string, pkg: string): Promise<string> {
  let projectPath = [currentPath, pkg].join('/')
  const exists = await fs.pathExists(projectPath)
  if (!exists) {
    return projectPath
  }

  pkg = await prompt(
    `A folder named ${bold(red(pkg))} already exists! ${bold('Choose a different name')}`,
    pkg + '-1'
  )

  // Yes, it's a recursion! Not my first rodeo
  return await ensureSafeProjectPath(currentPath, pkg)
}
