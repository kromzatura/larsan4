import MainLayoutShell from "./MainLayoutShell";

// Default export must conform to Next.js layout typing: only accepts { children }
export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayoutShell>{children}</MainLayoutShell>;
}
