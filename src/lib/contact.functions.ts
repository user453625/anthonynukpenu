import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

export const contactSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

/** Max enquiries accepted per sender (IP) per hour. */
export const CONTACT_HOURLY_LIMIT = 3;

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0] || "unknown";
    const ip_hash = await sha256(`nukpenu:${ip}`);
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await supabaseAdmin
      .from("contact_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ip_hash)
      .gte("created_at", since);
    if ((count ?? 0) >= CONTACT_HOURLY_LIMIT) {
      return { ok: false, error: "You've sent several messages recently. Please try again in an hour." };
    }
    const { error } = await supabaseAdmin.from("contact_enquiries").insert({
      full_name: data.full_name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ip_hash,
    });
    if (error) return { ok: false, error: "Could not send your message. Please try again." };
    return { ok: true };
  });
