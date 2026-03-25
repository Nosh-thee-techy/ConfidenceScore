import { NewsDomain } from '@/types/registry';

export const MOCK_REGISTRY: NewsDomain[] = [
  { domain: 'nation.africa', score: 88, trend: 'up', history: [82, 84, 85, 88, 87, 88], verified: true },
  { domain: 'bbc.co.uk', score: 92, trend: 'up', history: [90, 91, 91, 92, 92, 92], verified: true },
  { domain: 'nytimes.com', score: 91, trend: 'down', history: [94, 93, 92, 91, 91, 91], verified: true },
  { domain: 'aljazeera.com', score: 86, trend: 'up', history: [80, 82, 84, 85, 86, 86], verified: true },
  { domain: 'reuters.com', score: 95, trend: 'up', history: [94, 94, 95, 95, 95, 95], verified: true },
  { domain: 'theguardian.com', score: 89, trend: 'down', history: [91, 90, 89, 89, 89, 89], verified: true },
  { domain: 'standardmedia.co.ke', score: 78, trend: 'down', history: [82, 80, 79, 78, 78, 78], verified: false },
  { domain: 'cnn.com', score: 84, trend: 'up', history: [80, 82, 83, 84, 84, 84], verified: true },
  { domain: 'foxnews.com', score: 62, trend: 'down', history: [70, 68, 65, 62, 62, 62], verified: false },
  { domain: 'theeastafrican.co.ke', score: 85, trend: 'up', history: [80, 82, 83, 85, 85, 85], verified: true },
  { domain: 'lemonde.fr', score: 93, trend: 'up', history: [90, 91, 92, 93, 93, 93], verified: true },
  { domain: 'dw.com', score: 90, trend: 'up', history: [88, 89, 90, 90, 90, 90], verified: true },
];
