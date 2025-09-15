import { NextResponse } from "next/server";
import { getLastContactEmailHtml } from "@/app/actions/contact-form";

export async function GET() {
  const html = getLastContactEmailHtml();
  if (!html) {
    return NextResponse.json({ error: "No email captured yet" }, { status: 404 });
  }
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
