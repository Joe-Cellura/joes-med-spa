import { notFound } from "next/navigation";
import Navbar from "../../../src/components/layout/Navbar";
import Footer from "../../../src/components/layout/Footer";
import Container from "../../../src/components/ui/Container";
import Card from "../../../src/components/ui/Card";
import { getBlogPostBySlug, getAllBlogPosts } from "../../../src/data/blogPosts";

export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

function renderInline(text: string): string {
  // Very small inline formatter for **bold** markdown
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function parseBody(body: string, title: string): Block[] {
  const lines = body.split(/\r?\n/);
  const blocks: Block[] = [];

  const isMetaLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    const lower = trimmed.toLowerCase();
    if (trimmed === title.trim()) return true;
    if (lower === "lumina aesthetics — raleigh, north carolina") return true;
    if (lower === "introduction") return true;
    return false;
  };

  let i = 0;
  while (i < lines.length) {
    let raw = lines[i];
    let trimmed = raw.trim();

    if (!trimmed || isMetaLine(raw)) {
      i += 1;
      continue;
    }

    // List block
    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length) {
        raw = lines[i];
        trimmed = raw.trim();
        if (!trimmed.startsWith("- ")) break;
        items.push(trimmed.replace(/^-+\s*/, "").trim());
        i += 1;
      }
      if (items.length) {
        blocks.push({ type: "list", items });
      }
      continue;
    }

    // Paragraph or heading block
    const paraLines: string[] = [];
    while (i < lines.length) {
      raw = lines[i];
      trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith("- ") || isMetaLine(raw)) break;
      paraLines.push(trimmed);
      i += 1;
    }

    if (paraLines.length) {
      const text = paraLines.join(" ");
      const wordCount = text.split(/\s+/).length;
      const isHeading =
        wordCount <= 10 &&
        !text.includes(".") &&
        !text.endsWith("?") &&
        !text.endsWith("!");

      if (isHeading) {
        blocks.push({ type: "heading", text });
      } else {
        blocks.push({ type: "paragraph", text });
      }
    } else {
      i += 1;
    }
  }

  return blocks;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = parseBody(post.body, post.title);

  return (
    <div className="bg-slate-50 text-slate-900">
      <Navbar />
      <main className="px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <div className="mb-8 text-xs">
              <a
                href="/blog"
                className="mb-3 inline-flex items-center text-[11px] font-medium text-slate-500 hover:text-slate-700"
              >
                <span className="mr-1">&larr;</span>
                Back to Blog
              </a>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Lumina Aesthetics — Raleigh, North Carolina
                </p>
                <div className="h-px w-10 bg-slate-300" />
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {post.title}
                </h1>
                <p className="text-[11px] text-slate-500">
                  {post.readingTimeMinutes} min read
                </p>
              </div>
            </div>

            <Card className="bg-white">
              <article className="px-4 py-6 sm:px-6 sm:py-8">
                {blocks.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2
                        key={index}
                        className="mt-8 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
                      >
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.type === "list") {
                    return (
                      <ul
                        key={index}
                        className="mt-4 ml-5 list-disc space-y-1 text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-8"
                      >
                        {block.items.map((item, liIndex) => (
                          <li
                            key={liIndex}
                            dangerouslySetInnerHTML={{ __html: renderInline(item) }}
                          />
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p
                      key={index}
                      className="mt-4 text-[15px] font-light leading-7 text-slate-700 sm:text-base sm:leading-8"
                      dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                    />
                  );
                })}
              </article>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}


