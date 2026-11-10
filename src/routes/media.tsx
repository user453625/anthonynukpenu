import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Empty, PageHero, Section, meta } from "@/components/site/Chrome";
import { mediaQuery, youTubeId } from "@/lib/content";

export const Route = createFileRoute("/media")({
  head: () => ({ meta: meta("Media & Interviews — Anthony Nukpenu", "Photos, videos and interviews featuring Anthony Nukpenu.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(mediaQuery).then(() => undefined),
  component: Media,
});

function Media() {
  const { data } = useSuspenseQuery(mediaQuery);
  const cats = ["All", ...Array.from(new Set(data.map((m) => m.category)))];
  const [cat, setCat] = useState("All");
  const items = cat === "All" ? data : data.filter((m) => m.category === cat);
  return (
    <>
      <PageHero eyebrow="Media" title="Gallery & interviews" />
      <Section>
        <div className="mb-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`eyebrow px-4 py-2 ${c === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-accent"}`}>{c}</button>
          ))}
        </div>
        {items.length === 0 ? (
          <Empty>No media yet.</Empty>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => {
              const yt = youTubeId(m.url);
              return (
                <figure key={m.id} className="bg-card">
                  {yt ? (
                    <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title={m.title} allowFullScreen loading="lazy" />
                  ) : m.kind === "image" ? (
                    <img src={m.url} alt={m.title} className="aspect-video w-full object-cover" loading="lazy" />
                  ) : m.thumbnail_url ? (
                    <img src={m.thumbnail_url} alt={m.title} className="aspect-video w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="stripes-dense aspect-video w-full bg-primary-deep" />
                  )}
                  <figcaption className="p-4">
                    <p className="eyebrow text-campaign">{m.category}</p>
                    <a href={m.url} target="_blank" rel="noreferrer" className="mt-1 block font-bold hover:text-primary-deep">{m.title}</a>
                    {m.caption && <p className="mt-1 text-sm text-muted-foreground">{m.caption}</p>}
                    {m.credit && <p className="mt-1 text-xs text-muted-foreground">Credit: {m.credit}</p>}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
