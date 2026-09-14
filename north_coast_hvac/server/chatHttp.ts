import type { IncomingMessage, ServerResponse } from 'node:http';
import { getChatReply, parseChatInput } from './chatService.ts';

export type ChatRequest = IncomingMessage & { body?: unknown };
type Config = { apiKey?: string; model?: string };
const MAX_BYTES = 32_000;
const limits = new Map<string, { count: number; expires: number }>();

async function readBody(req: ChatRequest): Promise<unknown> {
  // Vercel has already parsed JSON; Vite exposes the raw Node request stream.
  if (req.body !== undefined) {
    const serialized = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(serialized) > MAX_BYTES) throw new Error('Request too large.');
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > MAX_BYTES) {
      req.resume();
      throw new Error('Request too large.');
    }
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function handleChat(req: ChatRequest, res: ServerResponse, config: Config) {
  const send = (status: number, body: unknown) => {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    send(405, { error: 'Use POST for chat.' });
    return;
  }
  if (!req.headers['content-type']?.toLowerCase().includes('application/json')) {
    send(415, { error: 'Use application/json.' });
    return;
  }
  if (Number(req.headers['content-length']) > MAX_BYTES) {
    send(413, { error: 'Request too large.' });
    return;
  }
  // Best-effort instance-local protection. A live deployment can replace this with shared rate limiting.
  const now = Date.now();
  if (limits.size > 2000) limits.clear();
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp =
    typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined;
  const key =
    (process.env.VERCEL ? clientIp : undefined) || req.socket.remoteAddress || 'local';
  const previous = limits.get(key);
  const entry =
    previous && previous.expires > now ? previous : { count: 0, expires: now + 60_000 };
  entry.count += 1;
  limits.set(key, entry);
  if (entry.count > 30) {
    res.setHeader('Retry-After', '60');
    send(429, { error: 'Please wait a moment before sending more messages.' });
    return;
  }
  try {
    const messages = parseChatInput(await readBody(req));
    send(200, await getChatReply(messages, config));
  } catch (error) {
    const tooLarge = error instanceof Error && error.message === 'Request too large.';
    send(tooLarge ? 413 : 400, {
      error: tooLarge ? 'Request too large.' : 'Send a valid, short chat message.',
    });
  }
}
