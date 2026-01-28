import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['api/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  bundle: true,
  minify: false,
  splitting: false,
  treeshake: true,
  platform: 'node',
  shims: true,
  noExternal: [/.*/],
})
