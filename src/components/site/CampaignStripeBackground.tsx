import { cn } from "@/lib/utils";

type Variant = "hero" | "about" | "leadership" | "transition" | "footer";

/**
 * Signature diagonal stripe composition. Pure CSS (transform/background-position animations),
 * reduced on mobile and disabled under prefers-reduced-motion via styles.css.
 */
export function CampaignStripeBackground({ variant = "hero", className }: { variant?: Variant; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {variant === "hero" && (
        <>
          <div className="absolute inset-0 bg-primary" />
          <div className="stripes parallax-slow absolute -inset-[10%] opacity-90" />
          <div className="stripes-dense absolute -inset-[10%] opacity-40 fade-mask-radial" />
          <div className="halftone-light absolute inset-0 opacity-30 fade-mask-l" />
          <div className="absolute -bottom-10 left-[-10%] h-24 w-[130%] -rotate-[8deg] bg-campaign" />
          <div className="absolute -bottom-10 left-[-10%] h-24 w-[130%] -rotate-[8deg] translate-y-28 bg-ink" />
        </>
      )}
      {variant === "about" && (
        <>
          <div className="stripes-dense absolute -inset-[20%] opacity-25 fade-mask-r" />
          <div className="halftone absolute right-0 top-0 h-2/3 w-1/2 opacity-20 fade-mask-radial" />
        </>
      )}
      {variant === "leadership" && (
        <>
          <div className="absolute inset-0 bg-ink" />
          <div className="stripes absolute -inset-[10%] opacity-50" />
          <div className="stripes-red absolute -inset-[10%] opacity-30 fade-mask-l" />
        </>
      )}
      {variant === "transition" && (
        <>
          <div className="absolute inset-0 bg-primary-deep" />
          <div className="stripes absolute -inset-[10%] opacity-70" />
          <div className="halftone-light absolute inset-0 opacity-20" />
        </>
      )}
      {variant === "footer" && (
        <>
          <div className="stripes-dense absolute -inset-[10%] opacity-20" />
          <div className="absolute left-0 top-0 h-1 w-full bg-campaign" />
        </>
      )}
    </div>
  );
}
