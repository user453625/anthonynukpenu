import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, Section, Sources, meta } from "@/components/site/Chrome";
import { CampaignStripeBackground } from "@/components/site/CampaignStripeBackground";
import { bioQuery, links } from "@/lib/content";
import portrait from "@/assets/nukpenu-campaign-portrait.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: meta("About Anthony Nukpenu — Biography", "Biography of Anthony Kwame Mensah Nukpenu, NDC Greater Accra Regional Organizer.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(bioQuery).then(() => undefined),
  component: About,
});

function About() {
  const { data } = useSuspenseQuery(bioQuery);
  return (
    <>
      <PageHero eyebrow="Biography" title="About Anthony" intro="A grassroots organiser serving the National Democratic Congress in Greater Accra." />
      <div className="relative">
        <CampaignStripeBackground variant="about" />
        <Section className="relative grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="md:sticky md:top-24 md:self-start">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={portrait} alt="Portrait of Anthony Kwame Mensah Nukpenu" className="h-full w-full object-cover object-[50%_20%]" />
            </div>
          </div>
          <div className="space-y-14">
            {data.map((s) => (
              <article key={s.id}>
                <span className="red-rule" />
                <h2 className="mt-4 text-4xl md:text-5xl">{s.title}</h2>
                {s.image_url && <img src={s.image_url} alt="" className="mt-6 w-full" loading="lazy" />}
                <div className="prose-editorial mt-5 whitespace-pre-line text-foreground/85">{s.body}</div>
                <Sources items={links(s.sources)} />
              </article>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
