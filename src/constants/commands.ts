import execa from 'execa'

export type PackageManager = 'pnpm' | 'yarn' | 'npm'

let manager: PackageManager

async function isManagerInstalled(manager: PackageManager): Promise<boolean> {
  try {
    await execa(manager, ['--version'])
    return true
  } catch {
    return false
  }
}

export async function getManager(): Promise<PackageManager> {
  if (manager) return manager

  if (await isManagerInstalled('pnpm')) {
    manager = 'pnpm'
  } else if (await isManagerInstalled('yarn')) {
    manager = 'yarn'
  } else {
    manager = 'npm'
  }

  return manager
}

export async function installPackages(packages: string[], dir: string): Promise<void> {
  const manager = await getManager()
  
  if (manager === 'pnpm') {
    await execa(manager, ['install', ...packages, '--save-dev'], { cwd: dir })
  } else if (manager === 'yarn') {
    await execa(manager, ['add', ...packages, '--dev'], { cwd: dir })
  } else {
    await execa(manager, ['install', ...packages, '--save-dev'], {cwd: dir})
  }
}
