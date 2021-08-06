import esbuild, { BuildFailure, BuildResult } from 'esbuild'
import { red, cyan, dim } from 'kolorist'
import { logChange } from './utils'

export default function watch(entryPoints: string[], outfile: string, forNode = false) {
  const config: esbuild.BuildOptions = {
    entryPoints: [...entryPoints],
    outfile: outfile,
    bundle: true,
    minify: false,
    metafile: true,
    watch: {
      onRebuild(error: BuildFailure | null, result: BuildResult | null) {
        if (error) {
          console.error('There was an error rebuilding changes.')
          if (error.stack) console.log(dim(error.stack))
          else console.log(error)
        } else if (result) {
          const { metafile, errors, warnings } = result

          if (metafile) logChange(metafile)
          if (errors.length) console.log(red('Erros: '), errors)
          if (warnings.length) console.log(cyan('Warnings: '), warnings)
        }
      }
    }
  }

  if (forNode) {
    config.target = 'node14'
    config.platform = 'node'
  }
  return esbuild.build(config)
}
