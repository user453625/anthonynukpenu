import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PageHero, Section, meta } from "@/components/site/Chrome";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitEnquiry, contactSchema } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: meta("Contact the Office — Anthony Nukpenu", "Send a message to the office of Anthony Kwame Mensah Nukpenu.") }),
  component: Contact,
});

function Contact() {
  const send = useServerFn(submitEnquiry);
  const [form, setForm] = useState({ full_name: "", email: "", subject: "", message: "", website: "" });
  const [err, setErr] = useState<string | null>(null);
  const m = useMutation({
    mutationFn: (d: typeof form) => send({ data: d }),
    onSuccess: (r) => setErr(r.ok ? null : r.error ?? "Error"),
    onError: () => setErr("Please check your details and try again."),
  });
  const done = m.data?.ok;
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <PageHero eyebrow="Contact" title="Write to the office" intro="Messages are read by the campaign office team." />
      <Section className="max-w-2xl">
        {done ? (
          <div className="border-l-4 border-primary bg-card p-8">
            <h2 className="text-4xl">Thank you</h2>
            <p className="mt-3">Your message has been received. The office will respond as soon as possible.</p>
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const p = contactSchema.safeParse(form);
              if (!p.success) return setErr("Please fill in every field. Messages need at least 10 characters.");
              setErr(null);
              m.mutate(form);
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div><Label htmlFor="n">Full name</Label><Input id="n" value={form.full_name} onChange={set("full_name")} maxLength={120} required /></div>
              <div><Label htmlFor="e">Email</Label><Input id="e" type="email" value={form.email} onChange={set("email")} maxLength={200} required /></div>
            </div>
            <div><Label htmlFor="s">Subject</Label><Input id="s" value={form.subject} onChange={set("subject")} maxLength={200} required /></div>
            <div><Label htmlFor="m">Message</Label><Textarea id="m" rows={7} value={form.message} onChange={set("message")} maxLength={4000} required /></div>
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={set("website")} />
            {err && <p className="text-sm font-semibold text-destructive">{err}</p>}
            <button disabled={m.isPending} className="bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary-deep disabled:opacity-60">
              {m.isPending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </Section>
    </>
  );
}
