import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  Files,
  User,
  ListCollapse,
  Quote,
  Menu,
  Settings,
  PhoneCall,
  Users,
  Info,
} from "lucide-react";
import { defaultDocumentNode } from "./defaultDocumentNode";

export const structure = (S: any, context: any) =>
  S.list()
    .title("Content")
    .items([
      orderableDocumentListDeskItem({
        type: "page",
        title: "Pages",
        icon: Files,
        S,
        context,
      }),
      S.listItem()
        .title("Posts")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Post")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]) // Default ordering
        ),
      S.listItem()
        .title("Changelogs")
        .schemaType("changelog")
        .child(
          S.documentTypeList("changelog")
            .title("Changelog")
            .defaultOrdering([{ field: "date", direction: "desc" }])
        ),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(
          S.documentTypeList("category")
            .title("Category")
            .defaultOrdering([{ field: "title", direction: "asc" }])
        ),
      orderableDocumentListDeskItem({
        type: "author",
        title: "Authors",
        icon: User,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "faq",
        title: "FAQs",
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "testimonial",
        title: "Testimonials",
        icon: Quote,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "team",
        title: "Team",
        icon: Users,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title("Banner")
        .icon(Info)
        .child(
          S.editor().id("banner").schemaType("banner").documentId("banner")
        ),
      S.listItem()
        .title("Contact")
        .icon(PhoneCall)
        .child(
          (
            defaultDocumentNode(S, { ...context, schemaType: "contact" }) ||
            S.document()
          )
            .id("contact")
            .schemaType("contact")
            .documentId("contact")
        ),
      orderableDocumentListDeskItem({
        type: "navigation",
        title: "Navigation",
        icon: Menu,
        S,
        context,
      }),
      S.listItem()
        .title("Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("settings")
            .schemaType("settings")
            .documentId("settings")
        ),
    ]);
