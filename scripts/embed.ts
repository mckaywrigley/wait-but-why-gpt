import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import { WBWJSON, WBWPost } from "./../types/index";

loadEnvConfig("");

const generateEmbeddings = async (posts: WBWPost[]) => {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  let chunkNum = 1;

  for (let i = 0; i < posts.length; i++) {
    const section = posts[i];

    for (let j = 0; j < section.chunks.length; j++) {
      const chunk = section.chunks[j];

      const { post_title, post_url, post_date, post_type, content, content_length, content_tokens } = chunk;

      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: content
      });

      if (embeddingResponse.status !== 200) {
        console.log("error", embeddingResponse);
      } else {
        const [{ embedding }] = embeddingResponse.data.data;

        const { data, error } = await supabase
          .from("wbw")
          .insert({
            post_title,
            post_url,
            post_date,
            post_type,
            content,
            content_length,
            content_tokens,
            embedding
          })
          .select("*");

        if (error) {
          console.log("not saved", error);
        } else {
          console.log("saved", i + 1, j + 1, chunkNum);
        }
      }

      chunkNum++;

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

(async () => {
  const book: WBWJSON = JSON.parse(fs.readFileSync("scripts/wbw.json", "utf8"));

  await generateEmbeddings(book.posts);
})();
