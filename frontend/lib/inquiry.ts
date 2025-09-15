export type InquiryItem = {
  id: string;
  name?: string | null;
};

export const INQUIRY_STORAGE_KEY = "inquiry:list";
export const INQUIRY_UPDATED_EVENT = "inquiryListUpdated";

function safeParse(json: string | null): InquiryItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed
        .map((x) => (x && typeof x.id === "string" ? { id: x.id, name: x.name ?? null } : null))
        .filter(Boolean) as InquiryItem[];
    }
  } catch {
    // ignore
  }
  return [];
}

export function getInquiryList(): InquiryItem[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(INQUIRY_STORAGE_KEY));
}

export function setInquiryList(items: InquiryItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(items));
  dispatchInquiryUpdated(items);
}

export function dispatchInquiryUpdated(items?: InquiryItem[]): void {
  if (typeof window === "undefined") return;
  const list = items ?? getInquiryList();
  const event = new CustomEvent(INQUIRY_UPDATED_EVENT, {
    detail: { count: list.length, items: list },
  });
  window.dispatchEvent(event);
}

export function isInInquiry(id: string): boolean {
  return getInquiryList().some((x) => x.id === id);
}

export function addToInquiry(item: InquiryItem): { added: boolean; items: InquiryItem[] } {
  const items = getInquiryList();
  if (items.some((x) => x.id === item.id)) {
    return { added: false, items };
  }
  const next = [...items, { id: item.id, name: item.name ?? null }];
  setInquiryList(next);
  return { added: true, items: next };
}

export function removeFromInquiry(id: string): { removed: boolean; items: InquiryItem[] } {
  const items = getInquiryList();
  const next = items.filter((x) => x.id !== id);
  const removed = next.length !== items.length;
  setInquiryList(next);
  return { removed, items: next };
}

export function clearInquiry(): void {
  setInquiryList([]);
}

export function getInquiryCount(): number {
  return getInquiryList().length;
}
