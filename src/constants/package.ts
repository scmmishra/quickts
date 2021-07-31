import { PackageJson } from 'type-fest'

const basePackage: PackageJson = {
  main: 'dist/index.js',
  typings: `dist/index.d.ts`,
  files: ['dist', 'src'],
  engines: {
    node: '>=10'
  },
  scripts: {
    start: 'quickts start',
    build: 'quickts build',
    test: 'quickts test',
    publish: 'quickts publish',
    size: 'size-limit',
    analyze: 'size-limit --why'
  },
  peerDependencies: {}
}

export default basePackage
