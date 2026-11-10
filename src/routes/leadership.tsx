import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, PageHero, Section, Sources, meta } from "@/components/site/Chrome";
import { links, timelineQuery } from "@/lib/content";

export const Route = createFileRoute("/leadership")({
  head: () => ({ meta: meta("Leadership Record — Anthony Nukpenu", "Timeline of Anthony Nukpenu's party leadership roles and elections within the NDC.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(timelineQuery).then(() => undefined),
  component: Leadership,
});

function Leadership() {
  const { data } = useSuspenseQuery(timelineQuery);
  return (
    <>
      <PageHero eyebrow="Leadership" title="The record" intro="Key roles and elections, each linked to its public source." />
      <Section>
        {data.length === 0 ? (
          <Empty>Timeline entries will appear here.</Empty>
        ) : (
          <ol className="relative border-l-4 border-primary pl-8">
            {data.map((t) => (
              <li key={t.id} className="relative mb-14">
                <span className="absolute -left-[42px] top-1 h-5 w-5 bg-campaign" />
                <p className="eyebrow text-campaign">{t.period}</p>
                <h2 className="mt-2 text-4xl">{t.title}</h2>
                {t.image_url && <img src={t.image_url} alt="" className="mt-4 max-w-xl" loading="lazy" />}
                <p className="prose-editorial mt-3 max-w-3xl whitespace-pre-line text-foreground/85">{t.description}</p>
                <Sources items={links(t.sources)} />
                {links(t.documents).length > 0 && (
                  <ul className="mt-2 text-sm">
                    {links(t.documents).map((d) => (
                      <li key={d.url}><a className="font-semibold text-primary-deep underline" href={d.url} target="_blank" rel="noreferrer">{d.label || "Document"}</a></li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
}
