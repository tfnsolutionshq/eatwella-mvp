import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const openaiKey = env.OPENAI_API_KEY || env.VITE_OPENAI_API_KEY || ''
  const openaiProject = env.OPENAI_PROJECT_ID || env.VITE_OPENAI_PROJECT_ID || ''
  const openaiHeaders = openaiKey ? { Authorization: `Bearer ${openaiKey}` } : {}

  return {
    plugins: [react()],
    base: '/',
    server: {
      proxy: {
        '/api': {
          target: 'https://identity.smt.tfnsolutions.us',
          changeOrigin: true,
          secure: false
        },
        '/memo-api': {
          target: 'https://memo.smt.tfnsolutions.us/api/v1',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/memo-api/, '')
        },
        '/settings-api': {
          target: 'https://setting.smt.tfnsolutions.us/api/v1',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/settings-api/, '')
        },
        '/openai': {
          target: 'https://api.openai.com',
          changeOrigin: true,
          secure: true,
          headers: openaiHeaders,
          rewrite: (path) => path.replace(/^\/openai/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (openaiKey) proxyReq.setHeader('Authorization', `Bearer ${openaiKey}`)
              if (openaiProject) proxyReq.setHeader('OpenAI-Project', openaiProject)
              proxyReq.setHeader('Content-Type', 'application/json')
            })
          }
        }
      }
    }
  }
})
