import execa from 'execa'

export type PackageManager = 'yarn' | 'npm'

let manager: PackageManager

export async function getManager(): Promise<PackageManager> {
  if (manager) return manager

  try {
    await execa('yarnpkg', ['--version'])
    manager = 'yarn'
  } catch (e) {
    manager = 'npm'
  }

  return manager
}

export async function installPackages(packages: string[], dir: string): Promise<void> {
  const manager = await getManager()

  if (manager === 'yarn') {
    await execa(manager, ['add', ...packages, '--dev'], { cwd: dir })
  } else {
    await execa(manager, ['install', ...packages, '--save-dev'])
  }
}
