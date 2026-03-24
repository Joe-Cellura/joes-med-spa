import { homepageConfig } from "../../lib/content";
import type { PromoStripConfig } from "../../lib/types";
import { AppLink } from "../ui/AppLink";

const promo = homepageConfig.sections.promoStrip as PromoStripConfig;

export function PromoStrip() {
  if (!promo.enabled) return null;

  return (
    <div className="border-b border-slate-200/80 bg-slate-50/90 py-2.5 text-center text-xs text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 sm:px-6">
        {promo.badge ? (
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
            {promo.badge}
          </span>
        ) : null}
        <span>{promo.message}</span>
        {promo.link ? (
          <AppLink
            href={promo.link.href}
            className="font-semibold text-teal-600 underline-offset-2 hover:text-teal-500 hover:underline"
          >
            {promo.link.label}
          </AppLink>
        ) : null}
      </div>
    </div>
  );
}

export default PromoStrip;
