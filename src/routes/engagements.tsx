import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, PageHero, Section, Sources, meta } from "@/components/site/Chrome";
import { engagementsQuery, fmtDate, links } from "@/lib/content";

export const Route = createFileRoute("/engagements")({
  head: () => ({ meta: meta("Public Engagements — Anthony Nukpenu", "Events, statements and community engagements by Anthony Nukpenu.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(engagementsQuery).then(() => undefined),
  component: Engagements,
});

function Engagements() {
  const { data } = useSuspenseQuery(engagementsQuery);
  return (
    <>
      <PageHero eyebrow="On the ground" title="Engagements" intro="Events, statements and community work." />
      <Section>
        {data.length === 0 ? (
          <Empty>Engagements will be published here soon.</Empty>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {data.map((e) => (
              <article key={e.id} className="border-l-4 border-campaign bg-card p-6">
                {e.image_url && <img src={e.image_url} alt="" className="mb-4 aspect-video w-full object-cover" loading="lazy" />}
                <p className="eyebrow text-muted-foreground">{e.category} · {fmtDate(e.event_date)}{e.venue && ` · ${e.venue}`}</p>
                <h2 className="mt-2 text-3xl">{e.title}</h2>
                <p className="mt-3 whitespace-pre-line text-foreground/85">{e.description}</p>
                {e.media_url && <a href={e.media_url} target="_blank" rel="noreferrer" className="mt-3 inline-block font-bold text-primary-deep underline">View media</a>}
                <Sources items={links(e.related_links)} />
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
