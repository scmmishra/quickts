const esbuild = require("esbuild");
const { red, cyan, green, dim } = require("kolorist");

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require("esbuild-node-externals");

function logChange(metafile) {
  console.log(metafile);
  console.log("Detected change in files: ", green(Object.keys(metafile.inputs).join(", ")));
  console.log("Generated output: ", green(Object.keys(metafile.outputs).join(", ")));
  console.log("");
}

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    minify: false,
    metafile: true,
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error("There was an error rebuilding changes.", error);
          console.log(dim(error.stack));
        } else {
          logChange(result.metafile);
          if (result.errors.length) {
            console.log(red("Erros: "), result.errors);
          }
          if (result.errors.warnings) {
            console.log(cyan("Warnings: "), result.warnings);
          }
        }
      },
    },
    platform: "node",
    target: "node14",
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
