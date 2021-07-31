const esbuild = require("esbuild");

export function watch(entryPoints: string[], outFile: string) {
  return esbuild.build({
    entryPoints: [...entryPoints],
    outfile: outFile,
    bundle: true,
    minify: false,
    watch: {
      onRebuild(error: Error, result: unknown) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
  });
}
