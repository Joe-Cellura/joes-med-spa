export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  readingTimeMinutes: number;
  body: string;
};

export const blogPosts: BlogPost[] = [];
