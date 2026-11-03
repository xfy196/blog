import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    target: 'node18',
    outDir: 'dist',
  },
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    dts: false,
    sourcemap: true,
    target: 'node18',
    outDir: 'dist',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
])
