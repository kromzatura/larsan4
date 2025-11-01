import * as React from "react";

export type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

function isHttpUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function isMailOrTel(href: string) {
  return href.startsWith("mailto:") || href.startsWith("tel:");
}

function mergeRel(existing?: string, add?: string) {
  const set = new Set<string>();
  (existing || "")
    .split(/\s+/)
    .filter(Boolean)
    .forEach((t) => set.add(t));
  (add || "")
    .split(/\s+/)
    .filter(Boolean)
    .forEach((t) => set.add(t));
  return Array.from(set).join(" ").trim() || undefined;
}

/**
 * ExternalLink
 * - Ensures safe defaults for external http(s) links:
 *   target="_blank" rel="noopener noreferrer nofollow"
 * - Leaves mailto: and tel: unchanged
 * - Allows overriding target/rel via props; defaults will be merged
 */
export function ExternalLink({ href, rel, target, children, ...rest }: ExternalLinkProps) {
  const isHttp = isHttpUrl(href);
  const isSpecial = isMailOrTel(href);

  const finalTarget = isHttp && !isSpecial ? target || "_blank" : target;
  const defaultRel = isHttp && !isSpecial ? "noopener noreferrer nofollow" : undefined;
  const finalRel = mergeRel(rel, defaultRel);

  return (
    <a href={href} target={finalTarget} rel={finalRel} {...rest}>
      {children}
    </a>
  );
}

export default ExternalLink;
