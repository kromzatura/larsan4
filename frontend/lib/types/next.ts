// Centralized Next.js App Router props types (canonical, non-Promise)
// These mirror the runtime reality: Next resolves params/searchParams before calling components.
// We will migrate pages/layouts to use these to remove async/await plumbing.

import type { ReactNode } from "react";

export type Params = Record<string, string | string[]>;
export type SearchParams = Record<string, string | string[] | undefined>;

export type LayoutProps<P extends Params = Params> = {
  children: ReactNode;
  params: P;
};

export type PageProps<P extends Params = Params, S extends SearchParams = SearchParams> = {
  params: P;
  searchParams: S;
};

// Async variants compatible with current Next.js emitted types
export type AsyncLayoutProps<P extends Params = Params> = {
  children: ReactNode;
  params?: Promise<P>;
};

export type AsyncPageProps<P extends Params = Params, S extends SearchParams = SearchParams> = {
  params?: Promise<P>;
  searchParams?: Promise<S>;
};

// Narrow helpers for common cases
export type LangParams = { lang?: string };
export type LangPageProps<S extends SearchParams = SearchParams> = PageProps<LangParams, S>;
export type LangLayoutProps = LayoutProps<LangParams>;

export type LangAsyncPageProps<S extends SearchParams = SearchParams> = AsyncPageProps<LangParams, S>;
export type LangAsyncLayoutProps = AsyncLayoutProps<LangParams>;
