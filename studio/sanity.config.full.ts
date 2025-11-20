/**
 * Full Sanity Studio configuration (backup). Restored from original before minimal reproduction.
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { media } from "sanity-plugin-media";
import { documentInternationalization } from "@sanity/document-internationalization";
import { assist } from "@sanity/assist";
import { codeInput } from "@sanity/code-input";

import { schema } from "./schema";
import { resolve } from "./presentation/resolve";
import { structure } from "./structure";
import { defaultDocumentNode } from "./defaultDocumentNode";

const singletonActions = new Set([
  "publish",
  "discardChanges",
  "restore",
  "unpublish",
  "delete",
]);

const singletonTypes = new Set(["settings", "contact"]);

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2025-02-19";
const SANITY_STUDIO_PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";

export default defineConfig({
  title: "Sanityblocks",
  projectId,
  dataset,
  schema: {
    types: schema.types,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        draftMode: { enable: "/api/draft-mode/enable" },
      },
      resolve,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
    media(),
    documentInternationalization({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "nl", title: "Dutch" },
      ],
      schemaTypes: [
        "settings",
        "contact",
        "post",
        "category",
        "banner",
        "changelog",
        "faq",
        "page",
        "testimonial",
        "product",
        "productCategory",
        "specification",
        "navigation",
        "author",
        "team",
      ],
      apiVersion: "2025-02-19",
    }),
    assist({
      assist: {
        localeSettings: () => Intl.DateTimeFormat().resolvedOptions(),
        maxPathDepth: 4,
        temperature: 0.3,
      },
      translate: {},
    }),
  ],
});
