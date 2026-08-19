import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatResponse } from '@health-portal/shared-types';
import { ApiError, apiPost } from '@/lib/apiClient';
import { useLanguage } from '@/context/LanguageContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type ChatStatus = 'idle' | 'sending' | 'error' | 'rate_limited';

const SESSION_KEY = 'hp_chat_session';

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return crypto.randomUUID();
  }
}

export function useChat(diseaseSlug: string) {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const lastContentRef = useRef<string>('');
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  useEffect(() => {
    setMessages([]);
    setStatus('idle');
    lastContentRef.current = '';
  }, [diseaseSlug]);

  const post = useCallback(
    async (content: string) => {
      setStatus('sending');
      try {
        const res = await apiPost<ChatResponse>('/ai/chat', {
          diseaseSlug,
          sessionId: sessionIdRef.current,
          lang,
          message: content,
        });
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: res.reply },
        ]);
        setStatus('idle');
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          setStatus('rate_limited');
        } else {
          setStatus('error');
        }
      }
    },
    [diseaseSlug, lang]
  );

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || status === 'sending') return;
      lastContentRef.current = content;
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content }]);
      await post(content);
    },
    [status, post]
  );

  const retry = useCallback(async () => {
    if (!lastContentRef.current || status === 'sending') return;
    await post(lastContentRef.current);
  }, [status, post]);

  const clear = useCallback(() => {
    setMessages([]);
    setStatus('idle');
    lastContentRef.current = '';
  }, []);

  return { messages, status, send, retry, clear };
}