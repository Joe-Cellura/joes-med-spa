import { cn } from "../../lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  centered?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  centered,
}: Props) {
  const alignClass =
    align === "center" || centered
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-2.5", alignClass, centered && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm font-light leading-relaxed text-slate-600">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeader;
