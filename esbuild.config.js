const esbuild = require("esbuild");
const { red, cyan } = require("kolorist");

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require("esbuild-node-externals");

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    minify: false,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else {
          console.log("Rebuilding...\n");
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
