const esbuild = require("esbuild");

export function build(entryPoints: string[], outFile: string) {
  return esbuild.build({
    entryPoints: [...entryPoints],
    outfile: outFile,
    bundle: true,
    minify: true,
  });
}
