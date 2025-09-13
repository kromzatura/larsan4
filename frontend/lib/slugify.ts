export default function slugify(inputString: string): string {
  return inputString
    .trim() // Remove leading and trailing spaces
    .replace(/\s+|_|[^\w-]/g, "-") // Replace spaces (including multiple consecutive), underscores, and non-word characters with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .toLowerCase(); // Convert to lowercase
}
