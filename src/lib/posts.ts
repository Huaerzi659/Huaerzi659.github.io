import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export interface TagSummary {
  tag: string;
  slug: string;
  href: string;
  count: number;
  latestDate: Date;
  posts: Post[];
}

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

export function slugifyTag(tag: string) {
  return tag.trim();
}

export function getTagHref(tag: string) {
  return `/topics/${encodeURIComponent(slugifyTag(tag))}/`;
}

export function getPostsByTag(posts: Post[], tag: string) {
  return sortPostsByDate(posts).filter((post) => post.data.tags.includes(tag));
}

export function getTagSummaries(posts: Post[]): TagSummary[] {
  return getAllTags(posts).map((tag) => {
    const taggedPosts = getPostsByTag(posts, tag);

    return {
      tag,
      slug: slugifyTag(tag),
      href: getTagHref(tag),
      count: taggedPosts.length,
      latestDate: taggedPosts[0]?.data.date ?? new Date(0),
      posts: taggedPosts,
    };
  });
}

export function findTagBySlug(posts: Post[], slug: string) {
  return getAllTags(posts).find((tag) => {
    const encoded = slugifyTag(tag);
    const decoded = decodeURIComponent(slug);

    return encoded === slug || tag === decoded;
  });
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
