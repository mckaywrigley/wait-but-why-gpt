--  RUN 1st
create extension vector;

-- RUN 2nd
create table wbw (
  id bigserial primary key,
  post_title text,
  post_url text,
  post_date text,
  post_type text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
);

-- RUN 3rd after running the scraping and embedding scripts
create or replace function wbw_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  post_title text,
  post_url text,
  post_date text,
  post_type text,
  content text,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    wbw.id,
    wbw.post_title,
    wbw.post_url,
    wbw.post_date,
    wbw.post_type,
    wbw.content,
    wbw.content_length,
    wbw.content_tokens,
    1 - (wbw.embedding <=> query_embedding) as similarity
  from wbw
  where 1 - (wbw.embedding <=> query_embedding) > similarity_threshold
  order by wbw.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on wbw
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);