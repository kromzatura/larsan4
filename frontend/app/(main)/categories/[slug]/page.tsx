import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import SectionHeader from "@/components/blocks/section-header";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getOgImageUrl } from "@/sanity/lib/fetch";

const CATEGORY_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description
  }
`;

const CATEGORY_POSTS_QUERY = groq`
  *[_type == "post" && references($categoryId)]|order(_createdAt desc){
    _id,
    title,
    slug,
    _createdAt
  }
`;

export async function generateStaticParams() {
  // Keep ISR-friendly by not prebuilding categories unless needed
  return [] as Array<{ slug: string }>;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { data: category } = await sanityFetch({ query: CATEGORY_QUERY, params: { slug }, perspective: "published", stega: false });
  if (!category) return {};
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
  return {
    title: category.title,
    description: category.description || undefined,
    openGraph: {
      images: [
        {
          url: getOgImageUrl({ type: "page", slug: `categories/${slug}` }),
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    robots: isProduction ? "index, follow" : "noindex, nofollow",
    alternates: {
      canonical: `/categories/${slug}`,
    },
  } as const;
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { data: category } = await sanityFetch({ query: CATEGORY_QUERY, params: { slug }, perspective: "published", stega: false });

  if (!category) {
    notFound();
  }

  const { data: posts } = await sanityFetch({ query: CATEGORY_POSTS_QUERY, params: { categoryId: category._id }, perspective: "published", stega: false });
  const postsArr = (posts ?? []) as Array<{ _id: string; title?: string; slug?: { current?: string } }>;

  return (
    <section className="container py-16 xl:py-20">
      <SectionHeader _type="section-header" _key="category-header" padding={null} sectionWidth="default" stackAlign="left" direction={null} tag={null} title={category.title} description={category.description} links={[]} />
      <Separator className="my-6" />
      {postsArr.length ? (
        <ul className="space-y-3">
          {postsArr.map((p) => (
            <li key={p._id}>
              <Link href={p.slug?.current ? `/blog/${encodeURIComponent(p.slug.current)}` : "/blog"} className="text-foreground hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No posts in this category yet.</p>
      )}
    </section>
  );
}
