import Link from "next/link";
import Navbar from "../../src/components/layout/Navbar";
import Footer from "../../src/components/layout/Footer";
import Container from "../../src/components/ui/Container";
import SectionHeader from "../../src/components/ui/SectionHeader";
import Card from "../../src/components/ui/Card";
import { getAllBlogPosts } from "../../src/data/blogPosts";

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="bg-slate-50 text-slate-900">
      <Navbar />
      <main className="pb-16 pt-12 sm:pb-20 sm:pt-16">
        <Container className="space-y-8">
          <SectionHeader
            title="Lumina Journal"
            subtitle="Educational notes from Lumina Aesthetics in Raleigh, North Carolina. Designed to help you feel informed, not overwhelmed."
            align="left"
          />

          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Card
                key={post.slug}
                hover
                className="flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    {post.title}
                  </h2>
                  <p className="text-sm font-light leading-relaxed text-slate-600">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{post.readingTimeMinutes} min read</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
                  >
                    Read article
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

