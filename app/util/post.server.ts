import { db } from "~/util/database.server";
import { formatDate } from "~/util/util";

interface RawPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: Date;
  tags: {
    tag: {
      name: string
    }
  }[];
  category: {
    name: string
  };
  author: {
    username: string
  };
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  published_at: string;
  tags: string[];
  category: string;
  author: string;
}

export type MinimumPost<T> = Omit<T, "content">;
export type MaximumPost<T> = Omit<T, "id" | "slug">;

export type Posts = Array<MinimumPost<Post>>

function formatPost(post: MinimumPost<RawPost>): MinimumPost<Post>;
function formatPost(post: MaximumPost<RawPost>): MaximumPost<Post>;

function formatPost(post: Omit<RawPost, "content" | "id" | "slug">) {
  return {
    ...post,
    published_at: formatDate(post.published_at),
    tags: post.tags.map(tag => tag.tag.name),
    category: post.category.name,
    author: post.author.username,
  };
}

async function getPostsWithoutFilter() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      published_at: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
    },
  });
  return posts.map(post => formatPost(post));
}

function getPostsWithFilter(filter: unknown) {
  // TODO implement
  return {} as any;
}

export function getPosts(filter?: unknown): Promise<Posts> {
  return filter ? getPostsWithFilter(filter) : getPostsWithoutFilter();
}

export async function getPost(identifier: string | undefined, fast: boolean): Promise<MaximumPost<Post> | null> {
  if (!identifier) return null;
  const post = await db.post.findUnique({
    select: {
      title: true,
      excerpt: true,
      content: true,
      published_at: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
    },
    where: fast ? {
      id: identifier,
    } : {
      slug: identifier,
    },
  });
  return post && formatPost(post);
}
