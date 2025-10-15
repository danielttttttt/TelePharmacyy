import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  // Expose all environment variables to the client
  const envWithProcess = {
    ...env,
    NODE_ENV: mode,
    // Only expose variables that start with VITE_ to the client
    ...Object.fromEntries(
      Object.entries(process.env)
        .filter(([key]) => key.startsWith('VITE_'))
    )
  }

  return {
    base: '/',
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
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:301',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    preview: {
      port: 300,
      proxy: {
        '/api': {
          target: 'http://localhost:301',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
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