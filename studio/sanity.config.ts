/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { documentInternationalization } from "@sanity/document-internationalization";
import { assist } from "@sanity/assist";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { media } from "sanity-plugin-media";

import { schema } from "./schema";
import { resolve } from "./presentation/resolve";
import { structure } from "./structure";
import { defaultDocumentNode } from "./defaultDocumentNode";
import { codeInput } from "@sanity/code-input";
import { LOCALES, LOCALE_LABELS } from "../shared/locales";

// Define the actions that should be available for singleton documents
const singletonActions = new Set([
  "publish",
  "discardChanges",
  "restore",
  "unpublish",
]);

// Define the singleton document types
const singletonTypes = new Set(["settings", "contact", "banner"]);

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2024-10-31";

const SANITY_STUDIO_PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";

// Feature Flags (Gate 3 / Gate 1 remediation)
export const ENABLE_STRUCTURED_PRICING = Boolean(
  process.env.NEXT_PUBLIC_ENABLE_STRUCTURED_PRICING
);

// Gate 1: Ability to instantly revert i18n v2 plugin without code removal
// Setting ENABLE_I18N_V2=false (or omitting) removes the document-level translation UI while
// preserving the language fields already on documents. This supports rollback during early gates.
export const ENABLE_I18N_V2 = process.env.ENABLE_I18N_V2 === "true";

export default defineConfig({
  title: "Sanityblocks",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schema.types,
    // Filter out singleton types from the global "New document" menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
  plugins: [
    // Conditionally include document-level translation plugin (Gate 1 feature flag)
    // Must appear BEFORE assist() when enabled so Assist can enhance translation actions.
    ...(ENABLE_I18N_V2
      ? [
          documentInternationalization({
            supportedLanguages: LOCALES.map((l) => ({
              id: l,
              title: LOCALE_LABELS[l] || l,
            })),
            schemaTypes: [
              "page",
              "post",
              "product",
              "productCategory",
              "category",
              "settings",
              "navigation",
              "faq",
              "specification",
            ],
          }),
        ]
      : []),
    // Assist kept independent so rollback of i18n plugin does not remove AI authoring assistance.
    assist(),
    structureTool({ structure, defaultDocumentNode }),
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        draftMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve,
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
    media(),
  ],
});
