import { Metadata } from "next";
import InquiryPageClient from "./pageClient";

export const metadata: Metadata = {
  title: "Inquiry",
};

export default function InquiryPage() {
  return <InquiryPageClient />;
}
