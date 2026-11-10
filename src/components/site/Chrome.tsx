import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CampaignStripeBackground } from "./CampaignStripeBackground";
import { SITE, settingsQuery, type SourceLink } from "@/lib/content";

export const NAV = [
  { to: "/about", label: "About" },
  { to: "/leadership", label: "Leadership" },
  { to: "/engagements", label: "Engagements" },
  { to: "/media", label: "Media" },
  { to: "/news", label: "News" },
  { to: "/transparency", label: "Transparency" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-sidebar-border bg-ink text-ink-foreground">
      <div className="h-1 w-full bg-campaign" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl text-primary">Nukpenu</span>
          <span className="eyebrow hidden text-ink-foreground/60 sm:inline">NDC · Neho!</span>
        </Link>
        <nav className="hidden gap-6 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow text-ink-foreground/75 transition-colors hover:text-ink-foreground" activeProps={{ className: "eyebrow text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-sidebar-border px-5 py-3 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="eyebrow py-3 text-ink-foreground/80">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { data } = useQuery(settingsQuery);
  const c = data?.contact ?? {};
  const s = data?.social ?? {};
  const socials = Object.entries(s).filter(([, v]) => v);
  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <CampaignStripeBackground variant="footer" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl">{SITE.short}</p>
          <p className="mt-3 text-sm text-ink-foreground/70">{SITE.role}, {SITE.party}. Candidate for {SITE.seeking}.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-ink-foreground/75 hover:text-ink-foreground">{n.label}</Link>
          ))}
        </div>
        <div className="space-y-1 text-sm text-ink-foreground/75">
          {c.email && <p>{c.email}</p>}
          {c.phone && <p>{c.phone}</p>}
          {c.office && <p>{c.office}</p>}
          <div className="flex flex-wrap gap-3 pt-2">
            {socials.map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noreferrer" className="eyebrow text-primary">{k}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative border-t border-sidebar-border px-5 py-4 text-center text-xs text-ink-foreground/50">
        © {new Date().getFullYear()} Office of {SITE.short} · <Link to="/auth" className="hover:text-ink-foreground">Staff login</Link>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden text-primary-foreground">
      <CampaignStripeBackground variant="transition" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20">
        <p className="eyebrow text-primary-foreground/80">{eyebrow}</p>
        <h1 className="reveal mt-4 max-w-4xl text-6xl md:text-8xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85">{intro}</p>}
      </div>
    </section>
  );
}

export function Sources({ items }: { items: SourceLink[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {items.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noreferrer" className="text-primary-deep underline underline-offset-2 hover:text-campaign">
            Source: {l.label || new URL(l.url).hostname}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="border border-dashed border-border p-10 text-center text-muted-foreground">{children}</p>;
}

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-5 py-16 ${className}`}>{children}</section>;
}

export function meta(title: string, description: string) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
