import Link from "next/link";
import Container from "../ui/Container";
import SectionHeader from "../ui/SectionHeader";
import Card from "../ui/Card";
import { getAllBlogPosts } from "../../data/blogPosts";

export function BlogPreviewSection() {
  const posts = getAllBlogPosts().slice(0, 3);

  if (!posts.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="space-y-10">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            title="From the Lumina Journal"
            subtitle="Short, educational notes to help you plan treatments, understand downtime, and feel more prepared for your visit."
            align="left"
          />
          <Link
            href="/blog"
            className="hidden text-sm font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline sm:inline"
          >
            View all articles
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} hover className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                {post.title}
              </h3>
              <p className="flex-1 text-xs font-light leading-relaxed text-slate-600">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{post.readingTimeMinutes} min read</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
                >
                  Read
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="sm:hidden">
          <Link
            href="/blog"
            className="text-xs font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
          >
            View all articles
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default BlogPreviewSection;

