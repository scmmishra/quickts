import * as fs from 'fs-extra'
import { prompt } from './prompts'
import path from 'path'

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

export async function writePrettyJson(
  projectPath: string,
  fileName: string,
  body: Record<string, unknown> | Record<string, unknown>[]
): Promise<void> {
  return fs.writeFile(path.resolve(projectPath, fileName), JSON.stringify(body, null, 2))
}
