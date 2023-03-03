import { WBWChunk, WBWJSON, WBWPost } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { encode } from "gpt-3-encoder";

const BASE_URL = "https://waitbutwhy.com";

const ARCHIVE_PAGE_1 = "/archive";
const ARCHIVE_PAGE_2 = "/archive/page/2";
const ARCHIVE_CLASS = ".archive-page";

const MINIS_PAGE_1 = "/minis";
const MINIS_PAGE_2 = "/minis/page/2";
const MINIS_CLASS = ".archive-postlist";

const CHUNK_SIZE = 200;

const getLinks = async (page: string, className: string) => {
  const fullLink = BASE_URL + page;
  const html = await axios.get(fullLink);
  const $ = cheerio.load(html.data);
  const list = $(className);

  const links: string[] = [];

  list.find("a").map((i, link) => {
    const href = $(link).attr("href");

    if (href) {
      links.push(href);
    }
  });

  const filteredLinks = [...new Set(links.filter((link) => link.endsWith(".html")))];

  return filteredLinks;
};

const getPost = async (url: string, type: "post" | "mini") => {
  let post: WBWPost = {
    title: "",
    url: "",
    date: "",
    type,
    content: "",
    length: 0,
    tokens: 0,
    chunks: []
  };

  const html = await axios.get(url);
  const $ = cheerio.load(html.data);

  const title = $("header h1").text().trim();
  const date = $("header .date").text().trim();
  const text = $(".entry-content #pico").text().trim();

  let cleanedText = text.replace(/\s+/g, " ");
  cleanedText = cleanedText.replace(/\.([a-zA-Z])/g, ". $1");

  const trimmedContent = cleanedText.trim();

  post = {
    title,
    url,
    date,
    type,
    content: trimmedContent,
    length: trimmedContent.length,
    tokens: encode(trimmedContent).length,
    chunks: []
  };

  return post;
};

const chunkPost = async (post: WBWPost) => {
  const { title, url, date, content } = post;

  let postTextChunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(". ");
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence);
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
        postTextChunks.push(chunkText);
        chunkText = "";
      }

      if (sentence[sentence.length - 1] && sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
        chunkText += sentence + ". ";
      } else {
        chunkText += sentence + " ";
      }
    }

    postTextChunks.push(chunkText.trim());
  } else {
    postTextChunks.push(content.trim());
  }

  const postChunks = postTextChunks.map((text) => {
    const trimmedText = text.trim();

    const chunk: WBWChunk = {
      post_title: title,
      post_url: url,
      post_date: date,
      post_type: post.type,
      content: trimmedText,
      content_length: trimmedText.length,
      content_tokens: encode(trimmedText).length,
      embedding: []
    };

    return chunk;
  });

  if (postChunks.length > 1) {
    for (let i = 0; i < postChunks.length; i++) {
      const chunk = postChunks[i];
      const prevChunk = postChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        postChunks.splice(i, 1);
        i--;
      }
    }
  }

  const chunkedSection: WBWPost = {
    ...post,
    chunks: postChunks
  };

  return chunkedSection;
};

(async () => {
  const archivePage1Links = await getLinks(ARCHIVE_PAGE_1, ARCHIVE_CLASS);
  const archivePage2Links = await getLinks(ARCHIVE_PAGE_2, ARCHIVE_CLASS);
  const archiveLinks = [...archivePage1Links, ...archivePage2Links];

  let posts = [];

  for (let i = 0; i < archiveLinks.length; i++) {
    const link = archiveLinks[i];
    const post = await getPost(link, "post");
    const chunkedPost = await chunkPost(post);

    posts.push(chunkedPost);
  }

  const minisPage1Links = await getLinks(MINIS_PAGE_1, MINIS_CLASS);
  const minisPage2Links = await getLinks(MINIS_PAGE_2, MINIS_CLASS);
  const minisLinks = [...minisPage1Links, ...minisPage2Links];

  for (let i = 0; i < minisLinks.length; i++) {
    const link = minisLinks[i];
    const post = await getPost(link, "mini");
    const chunkedPost = await chunkPost(post);

    posts.push(chunkedPost);
  }

  const todayDate = new Date().toISOString().split("T")[0];

  const json: WBWJSON = {
    current_date: todayDate,
    author: "Tim Urban",
    url: BASE_URL,
    length: posts.reduce((acc, essay) => acc + essay.length, 0),
    tokens: posts.reduce((acc, essay) => acc + essay.tokens, 0),
    posts
  };

  fs.writeFileSync("scripts/wbw.json", JSON.stringify(json));
})();
