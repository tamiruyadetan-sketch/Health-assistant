import { asyncHandler } from '@/lib/asyncHandler';
import { parseChatBody } from '@/middleware/validate';
import { generateChatReply } from '@/services/aiService';
import { getDiseaseBySlug } from '@/services/diseaseService';

export const chatHandler = asyncHandler(async (req, res) => {
  const body = parseChatBody(req.body);

  // Validate the disease exists before calling the AI provider.
  getDiseaseBySlug(body.diseaseSlug, body.lang);

  const { reply, disclaimer } = await generateChatReply({
    diseaseSlug: body.diseaseSlug,
    lang: body.lang,
    message: body.message,
    history: [],
  });

  res.status(200).json({ reply, disclaimer });
});