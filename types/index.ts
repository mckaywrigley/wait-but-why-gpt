export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo"
}

export type WBWPost = {
  title: string;
  url: string;
  date: string;
  type: "post" | "mini";
  content: string;
  length: number;
  tokens: number;
  chunks: WBWChunk[];
};

export type WBWChunk = {
  post_title: string;
  post_url: string;
  post_date: string | undefined;
  post_type: "post" | "mini";
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type LEXChunk = {
  pageContent: string;
  source: string;
  length: number;
};

export type WBWJSON = {
  current_date: string;
  author: string;
  url: string;
  length: number;
  tokens: number;
  posts: WBWPost[];
};
