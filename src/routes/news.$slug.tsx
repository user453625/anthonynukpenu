import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Section, Sources } from "@/components/site/Chrome";
import { articleQuery, fmtDate, links } from "@/lib/content";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    if (!a) throw notFound();
    return { title: a.seo_title || a.title, description: a.seo_description || a.excerpt, image: a.image_url };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found" }, { name: "robots", content: "noindex" }] };
    const m = [
      { title: `${loaderData.title} — Anthony Nukpenu` },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.image?.startsWith("https://")) {
      m.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    }
    return { meta: m };
  },
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleQuery(slug));
  if (!a) return null;
  return (
    <Section className="max-w-3xl">
      <Link to="/news" className="eyebrow text-primary-deep">← All news</Link>
      <p className="eyebrow mt-8 text-campaign">{a.category} · {fmtDate(a.published_at)}</p>
      <h1 className="mt-3 text-5xl md:text-7xl">{a.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">By {a.author}</p>
      {a.image_url && <img src={a.image_url} alt="" className="mt-8 w-full" />}
      <div className="prose-editorial mt-8 whitespace-pre-line">{a.body}</div>
      <Sources items={links(a.citations)} />
    </Section>
  );
}
