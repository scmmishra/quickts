export interface BuildOpts {
  name?: string
  entry?: string | string[]
  format: 'cjs,esm'
  target: 'browser' | 'node'
}

export type ModuleFormat = 'cjs' | 'umd' | 'esm' | 'system'
