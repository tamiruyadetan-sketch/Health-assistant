import env from '@/config/env';

export interface ClaudeMessageInput {
  systemPrompt: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  userMessage: string;
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const TIMEOUT_MS = 15_000;

export async function generateClaudeReply(input: ClaudeMessageInput): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.anthropicApiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: env.anthropicModel,
        max_tokens: 1024,
        system: input.systemPrompt,
        messages: [
          ...input.history.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: input.userMessage },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Anthropic API error: ${res.status} ${res.statusText}`);
    }

    const body = (await res.json()) as { content: { type: string; text: string }[] };
    const text = body.content?.find((block) => block.type === 'text')?.text ?? '';
    return text.trim();
  } finally {
    clearTimeout(timer);
  }
}