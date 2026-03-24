import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { isExternalUrl } from "../../lib/utils";

type AppLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

/**
 * Uses <a> for absolute http(s) URLs and Next Link for app routes.
 */
export function AppLink({ href, className, children, onClick }: AppLinkProps) {
  if (isExternalUrl(href)) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
