import { ReactNode } from "react";
import { cn } from "../../lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Optional hover elevation for premium tiles (e.g. treatment cards) */
  hover?: boolean;
};

export function Card({ children, className, hover = false }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7",
        hover &&
          "transition-shadow duration-200 hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:border-slate-200",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Card;
