import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export function sortPostsByDate(posts: Post[]) {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

export function getFeaturedPosts(posts: Post[]) {
  return sortPostsByDate(posts).filter((post) => post.data.featured);
}

export function getAllTags(posts: Post[]) {
  return Array.from(
    new Set(posts.flatMap((post) => post.data.tags))
  ).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
