export interface Hitokoto {
  id: number | string;
  uuid?: string;
  hitokoto: string; // Previously content
  type: string;     // Previously category (a, b, c...)
  from: string;     // Previously source
  from_who: string; // Previously author
  creator?: string;
  created_at?: string;
}
