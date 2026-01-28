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
  external: [
    '@libsql/client',
    '@libsql/darwin-arm64',
    '@libsql/darwin-x64',
    '@libsql/linux-arm64-gnu',
    '@libsql/linux-arm64-musl',
    '@libsql/linux-x64-gnu',
    '@libsql/linux-x64-musl',
    '@libsql/win32-x64-msvc',
  ],
})
