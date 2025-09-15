let lastContactEmailHtml: string | null = null;

export function setLastContactEmailHtml(html: string) {
  lastContactEmailHtml = html;
}

export function getLastContactEmailHtml() {
  return lastContactEmailHtml;
}
