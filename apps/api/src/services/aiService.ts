import type { ChatResponse, Locale } from '@health-portal/shared-types';
import { getDiseaseBySlug } from '@/services/diseaseService';
import { generateClaudeReply } from '@/aiProvider/claudeProvider';
import env from '@/config/env';

export const CHAT_DISCLAIMER = 'This is general health education information, not medical advice.';

const MAX_INPUT_LENGTH = 2000;

export interface AiChatInput {
  diseaseSlug: string;
  lang: Locale;
  message: string;
  history: { role: 'user' | 'assistant'; content: string }[];
}

function buildSystemPrompt(diseaseSlug: string, lang: Locale): string {
  const disease = getDiseaseBySlug(diseaseSlug, 'en');

  const content = [
    `Disease: ${disease.name}`,
    `Overview: ${disease.whatIsIt || 'No overview provided.'}`,
    `Causes: ${disease.causes || 'No causes provided.'}`,
    `How acquired: ${disease.howAcquired || 'Not provided.'}`,
    `Prevention: ${disease.prevention || 'Not provided.'}`,
    `Common symptoms: ${disease.symptoms.length > 0 ? disease.symptoms.join(', ') : 'Not provided.'}`,
    `Foods recommended: ${disease.foodsRecommended.length > 0 ? disease.foodsRecommended.join(', ') : 'Not provided.'}`,
    `Foods to avoid: ${disease.foodsToAvoid.length > 0 ? disease.foodsToAvoid.join(', ') : 'Not provided.'}`,
  ].join('\n');

  return [
    `You are a health education assistant for the Health Portal. You answer questions ONLY about "${disease.name}".`,
    'Ground every answer in the disease information below. If asked something not covered by it, say so and suggest consulting a healthcare professional.',
    'You must NEVER diagnose a user, prescribe treatment, or give medication dosages. If asked for personal medical advice, politely redirect the user to a qualified healthcare professional.',
    `Answer in ${lang === 'om' ? 'Afaan Oromoo' : 'English'}.`,
    'Always close with a short reminder that this is general information and not a substitute for professional medical advice.',
    'Keep answers clear, concise, and in plain language.',
    '',
    '=== Disease reference content ===',
    content,
  ].join('\n');
}

function buildFallbackReply(message: string, lang: Locale): string {
  const intro =
    lang === 'om'
      ? 'Waa’ee dhukkuba kanaa odeeffannoo afaan isaaniitti kennuuf, qophii gadi bu’aa gochaa jirra.'
      : 'The AI assistant is not configured yet, so I can share general guidance only.';

  const body =
    lang === 'om'
      ? 'Odeeffannoon kun hubannoo waliigalaa qofa. Rakkoon fayyaa ofii keetii ta’uu yoo isinitti fakkaate, rakkii qabaattuu ykn iddoo fayyaa qunnamaa, doktora keessan gaafadhaa.'
      : 'This information is general health education only and is not medical advice. If you have health concerns, please consult a qualified healthcare professional.';

  const fallbackLength = Math.min(message.length, MAX_INPUT_LENGTH);

  return `${intro}\n\n${body}\n\n(Asked: ${message.slice(0, fallbackLength)})`;
}

export async function generateChatReply(input: AiChatInput): Promise<ChatResponse> {
  if (env.anthropicApiKey) {
    try {
      const reply = await generateClaudeReply({
        systemPrompt: buildSystemPrompt(input.diseaseSlug, input.lang),
        history: input.history,
        userMessage: input.message,
      });
      return { reply, disclaimer: CHAT_DISCLAIMER };
    } catch (err) {
      console.error('[aiService] Claude call failed:', err);
    }
  }

  return {
    reply: buildFallbackReply(input.message, input.lang),
    disclaimer: CHAT_DISCLAIMER,
  };
}