import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type SourceLink = { label: string; url: string };

export const SITE = {
  name: "Anthony Kwame Mensah Nukpenu",
  short: "Anthony Nukpenu",
  role: "Greater Accra Regional Organizer",
  seeking: "Deputy National Organizer",
  party: "National Democratic Congress (NDC)",
};

export function links(v: unknown): SourceLink[] {
  return Array.isArray(v) ? (v as SourceLink[]).filter((l) => l && l.url) : [];
}

const pub = <T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>) =>
  Promise.resolve(p).then(({ data, error }) => {
    if (error) throw new Error(error.message);
    return data as T;
  });

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const rows = await pub(supabase.from("site_settings").select("key,value"));
    const map: Record<string, Record<string, string>> = {};
    for (const r of rows ?? []) map[r.key] = (r.value ?? {}) as Record<string, string>;
    return map;
  },
});

export const bioQuery = queryOptions({
  queryKey: ["bio"],
  queryFn: () => pub(supabase.from("biography_sections").select("*").eq("status", "published").order("sort_order")),
});

export const timelineQuery = queryOptions({
  queryKey: ["timeline"],
  queryFn: () =>
    pub(supabase.from("leadership_timeline").select("*").eq("status", "published").order("start_date", { ascending: false, nullsFirst: false })),
});

export const engagementsQuery = queryOptions({
  queryKey: ["engagements"],
  queryFn: () => pub(supabase.from("public_engagements").select("*").eq("status", "published").order("event_date", { ascending: false })),
});

export const mediaQuery = queryOptions({
  queryKey: ["media"],
  queryFn: () => pub(supabase.from("media_assets").select("*").eq("status", "published").order("created_at", { ascending: false })),
});

export const newsQuery = queryOptions({
  queryKey: ["news"],
  queryFn: () =>
    pub(
      supabase
        .from("news_articles")
        .select("*")
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false }),
    ),
});

export const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: () =>
      pub(supabase.from("news_articles").select("*").eq("slug", slug).eq("status", "published").maybeSingle()) as Promise<Tables<"news_articles"> | null>,
  });

export const financeQuery = queryOptions({
  queryKey: ["finance"],
  queryFn: () =>
    pub(supabase.from("financial_disclosures").select("*").eq("status", "published").order("published_on", { ascending: false })),
});

export function fmtDate(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function youTubeId(url: string | null | undefined) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}
