import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '@/hooks/useChat';
import MessageBubble from '@/components/ChatWidget/MessageBubble';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import Spinner from '@/components/Spinner';
import { AlertIcon, RefreshIcon, SendIcon, SparklesIcon } from '@/components/icons';
import { cx } from '@/lib/utils';

const MAX_MESSAGE_LENGTH = 2000;

interface ChatWidgetProps {
  diseaseSlug: string;
}

export default function ChatWidget({ diseaseSlug }: ChatWidgetProps) {
  const { t } = useTranslation();
  const { messages, status, send, retry } = useChat(diseaseSlug);
  const [input, setInput] = useState('');

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  const remaining = MAX_MESSAGE_LENGTH - input.length;
  const showCounter = remaining < 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === 'sending') return;
    void send(text);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-gray-200 p-4 dark:border-gray-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
          <SparklesIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('chat.title')}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('chat.subtitle')}</p>
        </div>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label={t('chat.title')}
        className="flex min-h-[16rem] max-h-80 flex-col gap-3 overflow-y-auto p-4"
      >
        {messages.length === 0 && status === 'idle' && (
          <p className="mx-auto my-auto max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">
            {t('chat.emptyState')}
          </p>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} content={message.content} />
        ))}

        {status === 'sending' && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <Spinner className="h-4 w-4" />
              {t('chat.thinking')}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/40">
            <p className="flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
              <AlertIcon className="h-4 w-4 shrink-0" />
              {t('chat.error')}
            </p>
            <button
              type="button"
              onClick={() => void retry()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-200 dark:bg-red-900/60 dark:text-red-100 dark:hover:bg-red-900"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              {t('chat.retry')}
            </button>
          </div>
        )}

        {status === 'rate_limited' && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertIcon className="h-4 w-4 shrink-0" />
            {t('chat.rateLimited')}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-3 dark:border-gray-800"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={status === 'sending'}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            aria-label={t('chat.placeholder')}
            placeholder={t('chat.placeholder')}
            className={cx(
              'max-h-32 flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
              showCounter && 'pb-8'
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || status === 'sending'}
            aria-label={t('chat.send')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>

        {showCounter && (
          <p
            className={cx(
              'mt-1 text-right text-xs',
              remaining <= 20 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {t('chat.charsLeft', { count: remaining })}
          </p>
        )}
      </form>

      <div className="px-4 pb-4">
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}