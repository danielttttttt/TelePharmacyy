import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const envWithProcess = {
    ...env,
    NODE_ENV: mode,
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key.startsWith('VITE_'))
    )
  }

  return {
    base: "./", // ✅ IMPORTANT FIX for Vercel
    plugins: [react()],
    define: {
      'process.env': envWithProcess,
      'import.meta.env': JSON.stringify(envWithProcess)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: true,
      manifest: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
        }
      }
    }
  }
})
