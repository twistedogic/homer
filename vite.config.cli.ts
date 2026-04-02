import { defineConfig, type Plugin } from 'vite';

function shebang(): Plugin {
  return {
    name: 'shebang',
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          chunk.code = '#!/usr/bin/env node\n' + chunk.code;
        }
      }
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: 'packages/cli/src/index.ts',
      formats: ['cjs'],
      fileName: () => 'homer-cli.cjs',
    },
    outDir: 'packages/cli/bin',
    emptyOutDir: false,
    rollupOptions: {
      external: ['commander'],
    },
  },
  plugins: [shebang()],
});
