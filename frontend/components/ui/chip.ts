export function chipClass(active: boolean) {
  const base =
    "inline-flex items-center rounded-md border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";
  return active
    ? `${base} bg-muted text-foreground`
    : `${base} text-muted-foreground hover:bg-muted`;
}
