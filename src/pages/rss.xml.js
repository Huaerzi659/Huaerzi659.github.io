import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { sortPostsByDate } from "../lib/posts";

export async function GET(context) {
  const posts = sortPostsByDate(await getCollection("posts"));

  return rss({
    title: "Waltz, Then Think",
    description: "Waltz 的个人博客：技术、经验、感想与灵感。",
    site: context.site,
    customData: "<language>zh-CN</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/articles/${post.id}/`,
    })),
  });
}
