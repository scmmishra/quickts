import esbuild from 'esbuild'

export default function build(entryPoints: string[], outfile: string, forNode: boolean = false) {
  const config: esbuild.BuildOptions = {
    entryPoints: [...entryPoints],
    outfile: outfile,
    bundle: true,
    minify: true
  }

  if (forNode) {
    config.target = 'node14'
    config.platform = 'node'
  }
  return esbuild.build(config)
}
