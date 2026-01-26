import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['api/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'api',
  outExtension: () => ({ js: '.js' }),
  clean: false,
  sourcemap: true,
  dts: false,
  external: ['@neondatabase/serverless'],
  noExternal: ['@low-seven/shared'],
})
