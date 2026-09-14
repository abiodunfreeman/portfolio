import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Alert, Button, Chip, IconButton, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Send,
  Snowflake,
  X,
} from 'lucide-react';
import {
  demoReply,
  hasSafetyConcern,
  type ChatMessage,
  type ChatReply,
} from '../../shared/chat';
import { requestId, saveRequest, validName, validPhone } from '../lib/requests';

type Bubble = ChatMessage & { id: string; localOnly?: boolean };
type CallbackStep = 'none' | 'name' | 'phone' | 'confirm';
const greeting: Bubble = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Hi, neighbor! I’m Frosty, your North Coast comfort helper. Need a repair, curious about pricing, or ready to plan a visit? I’m here to help.',
};
const quickQuestions = ['Service area', '$89 diagnostic', 'Emergency help'];

export default function Frosty({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Bubble[]>([greeting]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'demo' | 'ai' | null>(null);
  const [step, setStep] = useState<CallbackStep>('none');
  const [callback, setCallback] = useState({ name: '', phone: '' });
  const [offerBooking, setOfferBooking] = useState(false);
  const [storageError, setStorageError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !busy) {
      if (step === 'confirm') confirmRef.current?.focus();
      else inputRef.current?.focus();
    } else if (!open && wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open, busy, step]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open, step]);
  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open, setOpen]);

  function bubble(role: ChatMessage['role'], content: string, localOnly = false): Bubble {
    return { role, content, localOnly, id: crypto.randomUUID() };
  }
  function append(content: string, localOnly = false) {
    setMessages((previous) => [...previous, bubble('assistant', content, localOnly)]);
  }
  function cancelCallback() {
    setStep('none');
    setCallback({ name: '', phone: '' });
    setStorageError('');
    setDraft('');
    append(
      'Callback canceled. Nothing was saved. I’m here if you’d like to try something else.',
      true,
    );
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    if (content.length > 1200) {
      append('Please keep your message under 1,200 characters.');
      return;
    }
    setDraft('');
    if (step !== 'none') {
      if (hasSafetyConcern(content)) {
        setMessages((previous) => [
          ...previous,
          bubble('user', content, true),
          bubble('assistant', demoReply(content).message, true),
        ]);
        setStep('none');
        setCallback({ name: '', phone: '' });
        setStorageError('');
        return;
      }
      if (/^(cancel|stop|never mind|nevermind)$/i.test(content)) {
        cancelCallback();
        return;
      }
      setMessages((previous) => [...previous, bubble('user', content, true)]);
      if (step === 'name') {
        if (!validName(content)) {
          append(
            'What name should I use? Please enter 2–80 characters, using demo details.',
            true,
          );
          return;
        }
        setCallback({ name: content, phone: '' });
        setStep('phone');
        append(
          `Thanks, ${content.split(' ')[0]}. What’s the best US phone number for your demo callback? These details stay on this device.`,
          true,
        );
      } else if (step === 'phone') {
        if (!validPhone(content)) {
          append(
            'Please enter a 10-digit US number, including the area code—for example, (216) 555-0100.',
            true,
          );
          return;
        }
        setCallback((previous) => ({ ...previous, phone: content }));
        setStep('confirm');
        append(
          `Please review: ${callback.name}, ${content}. Save this demo callback request on this device? No one will call and nothing will be sent.`,
          true,
        );
      }
      return;
    }
    setOfferBooking(false);
    const next = [...messages, bubble('user', content)];
    setMessages(next);
    setBusy(true);
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 10_000);
    let reply: ChatReply;
    try {
      // Callback name/phone bubbles never enter the model's history.
      const history = next
        .filter((message) => !message.localOnly)
        .slice(-12)
        .map(({ role, content }) => ({
          role,
          content: content.slice(0, role === 'user' ? 1200 : 2400),
        }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ messages: history }),
      });
      if (!response.ok) throw new Error('Chat unavailable');
      const result: unknown = await response.json();
      if (
        !result ||
        typeof result !== 'object' ||
        !('message' in result) ||
        typeof result.message !== 'string' ||
        !('mode' in result) ||
        (result.mode !== 'demo' && result.mode !== 'ai')
      )
        throw new Error('Invalid reply');
      reply = result as ChatReply;
    } catch {
      reply = demoReply(content);
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
      setBusy(false);
    }
    setMode(reply.mode);
    append(reply.message);
    if (reply.action === 'booking') setOfferBooking(true);
    if (reply.action === 'callback') {
      setStep('name');
      setCallback({ name: '', phone: '' });
      append('First, what name should I put on the demo callback request?', true);
    }
  }

  function confirmCallback() {
    try {
      const id = requestId();
      // LIVE INTEGRATION: POST this callback to a Spring Boot endpoint, then show
      // success only after a successful response. This demo intentionally stores locally.
      saveRequest({
        id,
        kind: 'callback',
        ...callback,
        createdAt: new Date().toISOString(),
      });
      append(
        `Your demo callback request ${id} is saved on this device. This was a simulation—no one will call. Anything else I can help you with?`,
        true,
      );
      setStep('none');
      setCallback({ name: '', phone: '' });
      setStorageError('');
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : 'Unable to save your demo callback.',
      );
    }
  }
  function book() {
    navigate('/book');
    setOpen(false);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  return (
    <>
      {open && (
        <Paper
          className="frosty-panel"
          elevation={12}
          role="dialog"
          aria-modal="false"
          aria-labelledby="frosty-title"
        >
          <div className="frosty-header">
            <span className="frosty-avatar">
              <Snowflake size={27} />
            </span>
            <div>
              <h2 id="frosty-title">Hey, I’m Frosty.</h2>
              <span>Your North Coast comfort helper</span>
            </div>
            <IconButton aria-label="Close Frosty chat" onClick={() => setOpen(false)}>
              <X size={20} />
            </IconButton>
          </div>
          <div className="frosty-disclosure">
            Fictional business demo · please use sample details
          </div>
          <div
            ref={scrollRef}
            className="frosty-messages"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message) => (
              <div key={message.id} className={`chat-bubble ${message.role}`}>
                <span className="sr-only">
                  {message.role === 'user' ? 'You' : 'Frosty'}:{' '}
                </span>
                {message.content}
              </div>
            ))}
            {busy && (
              <div className="chat-typing" role="status">
                Frosty is replying<span>…</span>
              </div>
            )}
          </div>
          <div className="frosty-controls">
            {step === 'none' && (
              <>
                <div className="chat-suggestions">
                  {quickQuestions.map((question) => (
                    <Chip
                      key={question}
                      label={question}
                      variant="outlined"
                      size="small"
                      disabled={busy}
                      onClick={() => void send(question)}
                    />
                  ))}
                </div>
                <div className="chat-actions">
                  <Button
                    size="small"
                    disabled={busy}
                    onClick={() => void send('Request a callback')}
                  >
                    Request callback
                  </Button>
                  <Button
                    size="small"
                    disabled={busy}
                    onClick={book}
                    startIcon={<CalendarDays size={15} />}
                  >
                    Book a visit
                  </Button>
                </div>
              </>
            )}
            {offerBooking && step === 'none' && (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={book}
                endIcon={<ArrowRight size={16} />}
                className="mb-3"
              >
                Open booking form
              </Button>
            )}
            {storageError && (
              <Alert severity="error" className="mb-3">
                {storageError}
              </Alert>
            )}
            {step === 'confirm' ? (
              <div className="callback-confirm">
                <Button
                  ref={confirmRef}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={confirmCallback}
                >
                  Save demo callback
                </Button>
                <Button onClick={cancelCallback}>Cancel</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="frosty-input">
                <TextField
                  inputRef={inputRef}
                  size="small"
                  label={
                    step === 'name'
                      ? 'Your demo name'
                      : step === 'phone'
                        ? 'Demo phone number'
                        : 'Message Frosty'
                  }
                  type={step === 'phone' ? 'tel' : 'text'}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={busy}
                  slotProps={{ htmlInput: { maxLength: 1200, autoComplete: 'off' } }}
                />
                <IconButton
                  type="submit"
                  color="primary"
                  aria-label="Send message"
                  disabled={busy || !draft.trim()}
                >
                  <Send size={21} />
                </IconButton>
              </form>
            )}
            {(step === 'name' || step === 'phone') && (
              <Button size="small" onClick={cancelCallback}>
                Cancel callback
              </Button>
            )}
            <p className="chat-mode">
              {step !== 'none'
                ? 'Callback details stay on this device.'
                : mode === 'ai'
                  ? 'AI-assisted reply · answers may be imperfect.'
                  : mode === 'demo'
                    ? 'Demo answers active · no API key needed.'
                    : 'FAQs, callback requests & booking help.'}
            </p>
          </div>
        </Paper>
      )}
      <Button
        ref={launcherRef}
        className={`chat-launcher ${open ? 'is-open' : ''}`}
        variant="contained"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close Frosty chat' : 'Chat with Frosty'}
        aria-expanded={open}
        startIcon={open ? <X size={21} /> : <MessageCircle size={22} />}
      >
        <span>{open ? 'Close chat' : 'Chat with Frosty'}</span>
      </Button>
    </>
  );
}
