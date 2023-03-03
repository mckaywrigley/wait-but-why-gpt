import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const BASE_URL = "https://waitbutwhy.com";

const ARCHIVE_PAGE_1 = "/archive";
const ARCHIVE_PAGE_2 = "/archive/page/2";
const ARCHIVE_CLASS = ".post-list";

const MINIS_PAGE_1 = "/minis";
const MINIS_PAGE_2 = "/minis/page/2";

const getArchiveImages = async (page: string) => {
  const fullLink = BASE_URL + page;
  const html = await axios.get(fullLink);
  const $ = cheerio.load(html.data);
  const list = $(ARCHIVE_CLASS);
  const firstList = list.first();
  const li = firstList.find("li");

  let images: { title: string; src: string }[] = [];

  li.each((i, li) => {
    const title = $(li).find("h5").text().trim();
    const src = $(li).find("img").attr("src");

    if (title && src) {
      images.push({ title, src });
    }
  });

  return images;
};

const getMinisImages = async (page: string) => {
  const fullLink = BASE_URL + page;
  const html = await axios.get(fullLink);
  const $ = cheerio.load(html.data);
  const oneHalf = $(".one-half");

  let images: { title: string; src: string }[] = [];

  oneHalf.each((i, el) => {
    const title = $(el).find("h3").text().trim();
    const src = $(el).find("img").attr("src");

    if (title && src) {
      images.push({ title, src });
    }
  });

  return images;
};

(async () => {
  let images: { title: string; src: string }[] = [];

  const archivePage1Images = await getArchiveImages(ARCHIVE_PAGE_1);
  const archivePage2Images = await getArchiveImages(ARCHIVE_PAGE_2);

  const minisPage1Images = await getMinisImages(MINIS_PAGE_1);
  const minisPage2Images = await getMinisImages(MINIS_PAGE_2);

  images = [...archivePage1Images, ...archivePage2Images, ...minisPage1Images, ...minisPage2Images];

  console.log(images);
  console.log(images.length);

  fs.writeFileSync("scripts/images.json", JSON.stringify(images));
})();
