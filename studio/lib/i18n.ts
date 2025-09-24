import type { SlugValidationContext } from "sanity";

export async function isUniqueWithinLocale(
  slug: string,
  context: SlugValidationContext
) {
  const { document, getClient } = context;
  const language = (document as any)?.language;
  if (!language) return true;

  const client = getClient({ apiVersion: process.env.SANITY_STUDIO_API_VERSION || "2025-02-19" });
  const id = (document as any)?._id?.replace(/^drafts\./, "");
  const params = { id, language, slug } as const;
  const query = `!defined(*[!(sanity::versionOf($id)) && slug.current == $slug && language == $language][0]._id)`;
  const result = await client.fetch(query, params);
  return result;
}
