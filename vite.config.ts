import { defineConfig } from 'vite';

export default defineConfig({
  base: '/homer/',
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'node',
  },
});
