import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleChat } from './server/chatHttp.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const config = { apiKey: env.OPENAI_API_KEY, model: env.OPENAI_MODEL };
  const chatPlugin: Plugin = {
    name: 'frosty-local-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        void handleChat(req, res, config);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        void handleChat(req, res, config);
      });
    },
  };
  return { plugins: [react(), tailwindcss(), chatPlugin] };
});
