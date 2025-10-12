// Route group layout: props are provided by app/[lang]/layout.tsx, so this is a simple pass-through.
export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}
