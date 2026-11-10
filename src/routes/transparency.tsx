import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, PageHero, Section, meta } from "@/components/site/Chrome";
import { financeQuery, fmtDate } from "@/lib/content";

export const Route = createFileRoute("/transparency")({
  head: () => ({ meta: meta("Financial Transparency — Anthony Nukpenu", "Published funding and expenditure disclosures from the office of Anthony Nukpenu.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(financeQuery).then(() => undefined),
  component: Transparency,
});

function Transparency() {
  const { data } = useSuspenseQuery(financeQuery);
  return (
    <>
      <PageHero eyebrow="Accountability" title="Financial transparency" intro="Disclosures are published here as they are approved." />
      <Section>
        {data.length === 0 ? (
          <Empty>No disclosures have been published yet.</Empty>
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {data.map((d) => (
              <div key={d.id} className="grid gap-2 py-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="eyebrow text-muted-foreground">{d.category} · {d.reporting_period} {d.published_on && `· ${fmtDate(d.published_on)}`}</p>
                  <h2 className="mt-1 text-2xl">{d.title}</h2>
                  <p className="mt-1 text-sm text-foreground/80">{d.summary}</p>
                </div>
                <div className="text-right">
                  {d.amount_ghs != null && <p className="font-display text-3xl text-primary-deep">GH₵ {Number(d.amount_ghs).toLocaleString()}</p>}
                  {d.document_url && <a href={d.document_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-campaign underline">View document</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
