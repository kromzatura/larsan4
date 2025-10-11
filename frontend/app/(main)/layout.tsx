// Group layout wrapper – keeps the (main) segment simple and compliant with Next

// Default export must conform to Next.js layout typing: only accepts { children }
export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
