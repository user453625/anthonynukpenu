import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { CampaignStripeBackground } from "@/components/site/CampaignStripeBackground";
import { Section, meta } from "@/components/site/Chrome";
import { SITE, bioQuery, newsQuery, timelineQuery, fmtDate } from "@/lib/content";
import wide from "@/assets/campaign-wide.jpg.asset.json";
import poster from "@/assets/vote-poster.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: meta(
      "Anthony Kwame Mensah Nukpenu — For Deputy National Organizer, NDC",
      "Official website of Anthony Nukpenu, NDC Greater Accra Regional Organizer and candidate for Deputy National Organizer.",
    ),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(bioQuery);
    context.queryClient.ensureQueryData(timelineQuery);
    context.queryClient.ensureQueryData(newsQuery);
  },
  component: Index,
});

function Index() {
  const { data: bio } = useSuspenseQuery(bioQuery);
  const { data: timeline } = useSuspenseQuery(timelineQuery);
  const { data: news } = useSuspenseQuery(newsQuery);
  const intro = bio.find((b) => b.slug === "introduction");

  return (
    <>
      <section className="relative overflow-hidden text-primary-foreground">
        <CampaignStripeBackground variant="hero" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-8 px-5 pt-14 md:grid-cols-2 md:pt-20">
          <div className="pb-24 md:pb-36">
            <p className="eyebrow">NDC · Neho!</p>
            <h1 className="reveal mt-5 text-7xl md:text-[7.5rem]">
              Anthony
              <span className="block text-4xl text-ink md:text-6xl">Kwame Mensah</span>
              Nukpenu
            </h1>
            <p className="mt-6 inline-block bg-campaign px-4 py-2 font-display text-2xl text-campaign-foreground md:text-3xl">
              For {SITE.seeking}
            </p>
            <p className="mt-6 max-w-md text-sm font-semibold uppercase tracking-wide text-primary-foreground/85">
              Strategic planning and development of the NDC. Empowering vision and dynamic execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-sm font-bold text-ink-foreground hover:bg-campaign">
                Meet Anthony <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/leadership" className="inline-flex items-center gap-2 border-2 border-primary-foreground px-5 py-3 text-sm font-bold hover:bg-primary-foreground hover:text-primary-deep">
                Leadership record
              </Link>
            </div>
          </div>
          <div className="relative h-[420px] md:h-[620px]">
            <img
              src={wide.url}
              alt="Anthony Kwame Mensah Nukpenu in a green fugu smock"
              className="clip-diagonal absolute inset-0 h-full w-full object-cover object-right"
            />
          </div>
        </div>
      </section>

      <Section className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="red-rule" />
          <p className="eyebrow mt-4 text-primary-deep">Introduction</p>
          <h2 className="mt-3 text-5xl md:text-6xl">{SITE.role}</h2>
          {intro && <p className="prose-editorial mt-6 whitespace-pre-line text-foreground/85">{intro.body}</p>}
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-bold text-primary-deep hover:text-campaign">
            Full biography <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <img src={poster.url} alt="Vote Anthony Kwame Mensah Nukpenu as your next Deputy National Organizer" className="w-full shadow-xl" loading="lazy" />
      </Section>

      <section className="relative overflow-hidden text-ink-foreground">
        <CampaignStripeBackground variant="leadership" />
        <div className="relative mx-auto max-w-7xl px-5 py-20">
          <p className="eyebrow text-primary">Leadership record</p>
          <h2 className="mt-3 text-5xl md:text-7xl">Milestones</h2>
          <div className="mt-10 grid gap-px bg-sidebar-border md:grid-cols-3">
            {timeline.slice(0, 3).map((t) => (
              <div key={t.id} className="bg-ink p-6">
                <p className="eyebrow text-campaign">{t.period}</p>
                <h3 className="mt-3 text-2xl">{t.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm text-ink-foreground/70">{t.description}</p>
              </div>
            ))}
          </div>
          <Link to="/leadership" className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:text-ink-foreground">
            See the full timeline <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {news.length > 0 && (
        <Section>
          <span className="red-rule" />
          <h2 className="mt-4 text-5xl">Latest news</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group border-t-4 border-primary bg-card p-6 hover:border-campaign">
                <p className="eyebrow text-muted-foreground">{fmtDate(n.published_at)}</p>
                <h3 className="mt-3 text-2xl group-hover:text-primary-deep">{n.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.excerpt}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <section className="bg-campaign text-campaign-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center">
          <h2 className="text-4xl md:text-5xl">Get in touch with the office</h2>
          <Link to="/contact" className="bg-ink px-6 py-3 font-bold text-ink-foreground hover:bg-primary-deep">Contact us</Link>
        </div>
      </section>
    </>
  );
}
