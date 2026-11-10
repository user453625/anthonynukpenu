import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, PageHero, Section, meta } from "@/components/site/Chrome";
import { fmtDate, newsQuery } from "@/lib/content";

export const Route = createFileRoute("/news/")({
  head: () => ({ meta: meta("News & Updates — Anthony Nukpenu", "Official news, statements and updates from the office of Anthony Nukpenu.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQuery).then(() => undefined),
  component: News,
});

function News() {
  const { data } = useSuspenseQuery(newsQuery);
  return (
    <>
      <PageHero eyebrow="Newsroom" title="News & updates" />
      <Section>
        {data.length === 0 ? (
          <Empty>News articles will appear here.</Empty>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {data.map((n) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group bg-card">
                {n.image_url && <img src={n.image_url} alt="" className="aspect-video w-full object-cover" loading="lazy" />}
                <div className="border-t-4 border-primary p-6 group-hover:border-campaign">
                  <p className="eyebrow text-muted-foreground">{n.category} · {fmtDate(n.published_at)}</p>
                  <h2 className="mt-2 text-3xl group-hover:text-primary-deep">{n.title}</h2>
                  <p className="mt-2 text-muted-foreground">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
