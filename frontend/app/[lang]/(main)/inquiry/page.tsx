import { Metadata } from "next";
import InquiryPageClient from "./pageClient";

export const metadata: Metadata = {
  title: "Inquiry",
  robots: "noindex, nofollow",
  alternates: { canonical: "/inquiry" },
};

export default function InquiryPage() {
  return <InquiryPageClient />;
}
