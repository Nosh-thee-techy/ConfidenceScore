export interface NewsDomain {
  domain: string;
  score: number;
  trend: 'up' | 'down';
  history: number[];
  verified: boolean;
}
