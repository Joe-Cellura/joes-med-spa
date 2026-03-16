import { ReactNode } from "react";
import { cn } from "../../lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-medium text-teal-700",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
