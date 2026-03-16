"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  placeholderLabel: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  /** When "hero", placeholder is transparent so parent gradient/lighting shows through */
  placeholderVariant?: "default" | "hero";
};

/**
 * Renders an image when src exists and loads; otherwise (or on error) shows
 * a polished placeholder. Never shows broken image icons or raw alt text.
 */
export function OptionalImage({
  src,
  alt,
  placeholderLabel,
  className,
  fill = true,
  priority = false,
  placeholderVariant = "default",
}: Props) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    const isHero = placeholderVariant === "hero";
    return (
      <div
        className={cn(
          "flex min-h-[160px] items-center justify-center rounded-2xl text-center",
          !isHero && "bg-slate-100/90",
          isHero && "bg-transparent",
          className,
        )}
      >
        <span
          className={cn(
            "font-medium",
            !isHero && "text-sm text-slate-400",
            isHero && "text-sm text-slate-400/90",
          )}
        >
          {placeholderLabel}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className="object-cover"
        priority={priority}
        onError={() => setFailed(true)}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

export default OptionalImage;
