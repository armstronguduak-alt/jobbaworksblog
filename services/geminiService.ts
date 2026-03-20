import { AiModerationResult } from '../types';

const safeDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const moderateContent = async (title: string, content: string): Promise<AiModerationResult> => {
  const text = `${title} ${content}`.trim();
  const normalized = text.toLowerCase();

  await safeDelay(250);

  const spamSignals = ['http://', 'https://', 'buy now', 'free money', 'click here'];
  const hasSpamSignal = spamSignals.some(signal => normalized.includes(signal));

  return {
    grammarScore: hasSpamSignal ? 62 : 93,
    plagiarismRisk: 'low',
    isSpam: hasSpamSignal,
    summary: hasSpamSignal
      ? 'Content may be promotional. Please revise before submitting.'
      : 'Content structure looks good for editorial review.',
    flags: hasSpamSignal ? ['possible_promo_content'] : []
  };
};

export const getPostInsights = async (title: string, content: string): Promise<string> => {
  const cleaned = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!title && !cleaned) {
    return 'No content available for analysis yet.';
  }

  await safeDelay(300);

  const excerpt = cleaned.slice(0, 180);
  return excerpt
    ? `${title}: ${excerpt}${cleaned.length > 180 ? '…' : ''}`
    : `${title}: This post introduces a focused perspective with practical takeaways.`;
};
