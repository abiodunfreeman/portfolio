import type { ServerResponse } from 'node:http';
import { handleChat, type ChatRequest } from '../server/chatHttp.ts';

/** Vercel Node function. Secrets stay on the server and never enter the Vite bundle. */
export default async function handler(req: ChatRequest, res: ServerResponse) {
  await handleChat(req, res, {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL,
  });
}
