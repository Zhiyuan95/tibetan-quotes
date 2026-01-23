export interface Quote {
  id: number | string;
  content: string;
  author: string;
  source?: string;
  category?: string;
}
