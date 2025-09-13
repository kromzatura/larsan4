import { PAGE_QUERYResult } from "@/sanity.types";
import SectionHeader from "@/components/blocks/section-header";
import Hero12 from "@/components/blocks/hero/hero12";
import Hero13 from "@/components/blocks/hero/hero13";
import Hero25 from "@/components/blocks/hero/hero25";
import Hero57 from "@/components/blocks/hero/hero57";
import Hero85 from "@/components/blocks/hero/hero85";
import Hero160 from "@/components/blocks/hero/hero160";
import Hero174 from "@/components/blocks/hero/hero174";
import Logos1 from "@/components/blocks/logo/logos1";
import Logos2 from "@/components/blocks/logo/logos2";
import Logos4 from "@/components/blocks/logo/logos4";
import Logos9 from "@/components/blocks/logo/logos9";
import FAQ1 from "@/components/blocks/faq/faq1";
import FAQ5 from "@/components/blocks/faq/faq5";
import FAQ8 from "@/components/blocks/faq/faq8";
import FAQ9 from "@/components/blocks/faq/faq9";
import FAQ14 from "@/components/blocks/faq/faq14";
import Feature1 from "@/components/blocks/feature/feature1";
import Feature3 from "@/components/blocks/feature/feature3";
import Feature12 from "@/components/blocks/feature/feature12";
import Feature15 from "@/components/blocks/feature/feature15";
import Feature66 from "@/components/blocks/feature/feature66";
import Feature117 from "@/components/blocks/feature/feature117";
import Feature157 from "@/components/blocks/feature/feature157";
import Feature202 from "@/components/blocks/feature/feature202";
import Blog4 from "@/components/blocks/blog/blog4";
import AllPosts4 from "@/components/blocks/blog/blog4/all-posts";
import Blog7 from "@/components/blocks/blog/blog7";
import AllPosts7 from "@/components/blocks/blog/blog7/all-posts";
import Blog13 from "@/components/blocks/blog/blog13";
import AllPosts13 from "@/components/blocks/blog/blog13/all-posts";
import Blog14 from "@/components/blocks/blog/blog14";
import AllPosts14 from "@/components/blocks/blog/blog14/all-posts";
import Blog16 from "@/components/blocks/blog/blog16";
import AllPosts16 from "@/components/blocks/blog/blog16/all-posts";
import Changelog1 from "@/components/blocks/changelog/changelog1";
import Changelog2 from "@/components/blocks/changelog/changelog2";
import Changelog3 from "@/components/blocks/changelog/changelog3";
import Changelog5 from "@/components/blocks/changelog/changelog5";
import Pricing1 from "@/components/blocks/pricing/pricing1";
import Pricing2 from "@/components/blocks/pricing/pricing2";
import Pricing7 from "@/components/blocks/pricing/pricing7";
import Pricing9 from "@/components/blocks/pricing/pricing9";
import Pricing16 from "@/components/blocks/pricing/pricing16";
import Team1 from "@/components/blocks/team/team1";
import Team2 from "@/components/blocks/team/team2";
import Team3 from "@/components/blocks/team/team3";
import Team4 from "@/components/blocks/team/team4";
import Team5 from "@/components/blocks/team/team5";
import Team6 from "@/components/blocks/team/team6";
import Team8 from "@/components/blocks/team/team8";
import Compare1 from "@/components/blocks/compare/compare1";
import Compare2 from "@/components/blocks/compare/compare2";
import Compare4 from "@/components/blocks/compare/compare4";
import Compare5 from "@/components/blocks/compare/compare5";
import Compare6 from "@/components/blocks/compare/compare6";
import Gallery1 from "@/components/blocks/gallery/gallery1";
import Gallery3 from "@/components/blocks/gallery/gallery3";
import Gallery4 from "@/components/blocks/gallery/gallery4";
import Gallery8 from "@/components/blocks/gallery/gallery8";
import Gallery9 from "@/components/blocks/gallery/gallery9";
import Gallery10 from "@/components/blocks/gallery/gallery10";
import Timeline3 from "@/components/blocks/timelines/timeline3";
import Timeline4 from "@/components/blocks/timelines/timeline4";
import Timeline5 from "@/components/blocks/timelines/timeline5";
import Timeline6 from "@/components/blocks/timelines/timeline6";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];

const componentMap: {
  [K in Block["_type"]]: React.ComponentType<Extract<Block, { _type: K }>>;
} = {
  "section-header": SectionHeader,
  "hero-12": Hero12,
  "hero-13": Hero13,
  "hero-25": Hero25,
  "hero-57": Hero57,
  "hero-85": Hero85,
  "hero-160": Hero160,
  "hero-174": Hero174,
  "faq-1": FAQ1,
  "faq-5": FAQ5,
  "faq-8": FAQ8,
  "faq-9": FAQ9,
  "faq-14": FAQ14,
  "logos-1": Logos1,
  "logos-2": Logos2,
  "logos-4": Logos4,
  "logos-9": Logos9,
  "feature-1": Feature1,
  "feature-3": Feature3,
  "feature-12": Feature12,
  "feature-15": Feature15,
  "feature-66": Feature66,
  "feature-117": Feature117,
  "feature-157": Feature157,
  "feature-202": Feature202,
  "blog-4": Blog4,
  "all-posts-4": AllPosts4,
  "blog-7": Blog7,
  "all-posts-7": AllPosts7,
  "blog-13": Blog13,
  "all-posts-13": AllPosts13,
  "blog-14": Blog14,
  "all-posts-14": AllPosts14,
  "blog-16": Blog16,
  "all-posts-16": AllPosts16,
  "changelog-1": Changelog1,
  "changelog-2": Changelog2,
  "changelog-3": Changelog3,
  "changelog-5": Changelog5,
  "pricing-1": Pricing1,
  "pricing-2": Pricing2,
  "pricing-7": Pricing7,
  "pricing-9": Pricing9,
  "pricing-16": Pricing16,
  "team-1": Team1,
  "team-2": Team2,
  "team-3": Team3,
  "team-4": Team4,
  "team-5": Team5,
  "team-6": Team6,
  "team-8": Team8,
  "compare-1": Compare1,
  "compare-2": Compare2,
  "compare-4": Compare4,
  "compare-5": Compare5,
  "compare-6": Compare6,
  "gallery-1": Gallery1,
  "gallery-3": Gallery3,
  "gallery-4": Gallery4,
  "gallery-8": Gallery8,
  "gallery-9": Gallery9,
  "gallery-10": Gallery10,
  "timeline-3": Timeline3,
  "timeline-4": Timeline4,
  "timeline-5": Timeline5,
  "timeline-6": Timeline6,
};

export default function Blocks({
  blocks,
  searchParams,
}: {
  blocks: Block[];
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  return (
    <>
      {blocks?.map((block) => {
        const Component = componentMap[block._type];
        if (!Component) {
          // Fallback for development/debugging of new component types
          console.warn(
            `No component implemented for block type: ${block._type}`
          );
          return <div data-type={block._type} key={block._key} />;
        }
        return (
          <Component
            {...(block as any)}
            key={block._key}
            searchParams={searchParams}
          />
        );
      })}
    </>
  );
}
