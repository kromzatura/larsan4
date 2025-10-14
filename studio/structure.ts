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
  Palette,
} from "lucide-react";
import { defaultDocumentNode } from "./defaultDocumentNode";

export const structure = (S: any, context: any) =>
  S.list()
    .title("Content")
    .items([
      // Pinned site-wide Theme (singleton-like entry)
      S.listItem()
        .title("Site Theme")
        .icon(Palette)
        .child(
          S.editor()
            .id("site-theme")
            .schemaType("theme")
            .documentId("theme.default")
        ),
      // Products (manual ordering, split per language)
      S.listItem()
        .title("Products")
        .icon(ListCollapse)
        .child(
          S.list()
            .title("Products")
            .items([
              orderableDocumentListDeskItem({
                type: "product",
                title: "Products (EN)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-product-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "product",
                title: "Products (NL)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-product-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
      // Specifications (manual ordering, split per language)
      S.listItem()
        .title("Specifications")
        .icon(ListCollapse)
        .child(
          S.list()
            .title("Specifications")
            .items([
              orderableDocumentListDeskItem({
                type: "specification",
                title: "Specifications (EN)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-specification-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "specification",
                title: "Specifications (NL)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-specification-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
      // Product Categories (manual ordering, split per language)
      S.listItem()
        .title("Product Categories")
        .icon(ListCollapse)
        .child(
          S.list()
            .title("Product Categories")
            .items([
              orderableDocumentListDeskItem({
                type: "productCategory",
                title: "Categories (EN)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-productCategory-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "productCategory",
                title: "Categories (NL)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-productCategory-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
      S.divider(),
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
      // Authors (manual ordering, split per language)
      S.listItem()
        .title("Authors")
        .icon(User)
        .child(
          S.list()
            .title("Authors")
            .items([
              orderableDocumentListDeskItem({
                type: "author",
                title: "Authors (EN)",
                icon: User,
                S,
                context,
                id: "orderable-author-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "author",
                title: "Authors (NL)",
                icon: User,
                S,
                context,
                id: "orderable-author-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
      // FAQs (manual ordering, split per language)
      S.listItem()
        .title("FAQs")
        .icon(ListCollapse)
        .child(
          S.list()
            .title("FAQs")
            .items([
              orderableDocumentListDeskItem({
                type: "faq",
                title: "FAQs (EN)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-faq-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "faq",
                title: "FAQs (NL)",
                icon: ListCollapse,
                S,
                context,
                id: "orderable-faq-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
      // Testimonials (manual ordering, split per language)
      S.listItem()
        .title("Testimonials")
        .icon(Quote)
        .child(
          S.list()
            .title("Testimonials")
            .items([
              orderableDocumentListDeskItem({
                type: "testimonial",
                title: "Testimonials (EN)",
                icon: Quote,
                S,
                context,
                id: "orderable-testimonial-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "testimonial",
                title: "Testimonials (NL)",
                icon: Quote,
                S,
                context,
                id: "orderable-testimonial-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
      // Team (manual ordering, split per language)
      S.listItem()
        .title("Team")
        .icon(Users)
        .child(
          S.list()
            .title("Team")
            .items([
              orderableDocumentListDeskItem({
                type: "team",
                title: "Team (EN)",
                icon: Users,
                S,
                context,
                id: "orderable-team-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "team",
                title: "Team (NL)",
                icon: Users,
                S,
                context,
                id: "orderable-team-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
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
      // Navigation (manual ordering, split per language)
      S.listItem()
        .title("Navigation")
        .icon(Menu)
        .child(
          S.list()
            .title("Navigation")
            .items([
              orderableDocumentListDeskItem({
                type: "navigation",
                title: "Navigation (EN)",
                icon: Menu,
                S,
                context,
                id: "orderable-navigation-en",
                filter: "language == $lang",
                params: { lang: "en" },
              }),
              orderableDocumentListDeskItem({
                type: "navigation",
                title: "Navigation (NL)",
                icon: Menu,
                S,
                context,
                id: "orderable-navigation-nl",
                filter: "language == $lang",
                params: { lang: "nl" },
              }),
            ])
        ),
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
