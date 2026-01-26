import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['api/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  outExtension: () => ({ js: '.js' }),
  clean: true,
  sourcemap: true,
  dts: false,
  external: ['@neondatabase/serverless'],
  noExternal: ['@low-seven/shared'],
})
