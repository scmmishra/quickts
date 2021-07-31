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

export async function writePretty(
  projectPath: string,
  fileName: string,
  body: Record<string, unknown> | Record<string, unknown>[] | string
): Promise<void> {
  if (typeof body === 'string') {
    return fs.writeFile(path.resolve(projectPath, fileName), body)
  }
  return fs.writeFile(path.resolve(projectPath, fileName), JSON.stringify(body, null, 2))
}

export async function deleteFile(projectPath: string, segements: string[] | string): Promise<void> {
  if (typeof segements === 'string') {
    segements = [segements]
  }
  return fs.unlink(path.resolve(projectPath, ...segements))
}

export async function deleteDir(projectPath: string, segements: string[] | string): Promise<void> {
  if (typeof segements === 'string') {
    segements = [segements]
  }
  return fs.rmdir(path.resolve(projectPath, ...segements), { recursive: true })
}
