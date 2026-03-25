export type IntakeChannel = 'angaza' | 'article' | 'media';

export const CHANNEL_LABELS: Record<IntakeChannel, { title: string; subtitle: string; example: string }> = {
  angaza: {
    title: 'Angaza (WhatsApp)',
    subtitle: 'Street-level access · same engine',
    example: '"Did CBK ban M-Pesa?"',
  },
  article: {
    title: 'Article URL',
    subtitle: 'Full CS-Index · deep audit',
    example: 'nation.africa / housing policy',
  },
  media: {
    title: 'Image / video',
    subtitle: 'Media integrity layer',
    example: 'Suspicious clip or screenshot',
  },
};

export function parseChannel(value: string | null): IntakeChannel {
  if (value === 'angaza' || value === 'article' || value === 'media') return value;
  return 'article';
}
