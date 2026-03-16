import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500";

  const variants: Record<typeof variant, string> = {
    primary:
      "bg-teal-600 text-white shadow-sm hover:bg-teal-500 focus-visible:ring-teal-500",
    outline:
      "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
    ghost:
      "text-slate-700 hover:bg-slate-100",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
