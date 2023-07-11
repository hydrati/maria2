/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    setupFiles: ['tests/utils/global.ts'],
  },
})
