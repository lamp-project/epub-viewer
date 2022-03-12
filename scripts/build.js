const { build } = require('esbuild');
const glob = require("tiny-glob");

(async () => {
	const entryPoints = await glob("./src/**/*.ts");
	build({
		entryPoints,
		outdir: 'dist',
		bundle: false,
		// minify: true,
		sourcemap: true,
		platform: 'node',
	});
})().catch(() => {
	process.exit(1);
});
