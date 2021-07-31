import { green } from 'kolorist'
import { Metafile } from 'esbuild'

export function logChange(metafile: Metafile) {
  console.log(metafile)
  console.log('Detected change in files: ', green(Object.keys(metafile.inputs).join(', ')))
  console.log('Generated output: ', green(Object.keys(metafile.outputs).join(', ')))
  console.log('')
}
