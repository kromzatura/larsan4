import { groq } from "next-sanity";
import { metaQuery } from "./shared/meta";
import { sectionHeaderQuery } from "./section-header";
import { hero12Query } from "./hero/hero12";
import { hero13Query } from "./hero/hero13";
import { hero25Query } from "./hero/hero25";
import { hero57Query } from "./hero/hero57";
import { hero85Query } from "./hero/hero85";
import { hero160Query } from "./hero/hero160";
import { hero174Query } from "./hero/hero174";
import { faq1Query } from "./faq/faq1";
import { faq5Query } from "./faq/faq5";
import { faq8Query } from "./faq/faq8";
import { faq9Query } from "./faq/faq9";
import { faq14Query } from "./faq/faq14";
import { logos1Query } from "./logos/logos1";
import { logos2Query } from "./logos/logos2";
import { logos4Query } from "./logos/logos4";
import { logos9Query } from "./logos/logos9";
import { feature1Query } from "./feature/feature1";
import { feature3Query } from "./feature/feature3";
import { feature12Query } from "./feature/feature12";
import { feature15Query } from "./feature/feature15";
import { feature66Query } from "./feature/feature66";
import { feature117Query } from "./feature/feature117";
import { feature157Query } from "./feature/feature157";
import { feature202Query } from "./feature/feature202";
import { blog4Query } from "./blog/blog4";
import { allPosts4Query } from "./blog/blog4/all-posts";
import { blog7Query } from "./blog/blog7";
import { allPosts7Query } from "./blog/blog7/all-posts";
import { blog13Query } from "./blog/blog13";
import { allPosts13Query } from "./blog/blog13/all-posts";
import { blog14Query } from "./blog/blog14";
import { allPosts14Query } from "./blog/blog14/all-posts";
import { blog16Query } from "./blog/blog16";
import { allPosts16Query } from "./blog/blog16/all-posts";
import { changelog1Query } from "./blog/changelog/changelog1";
import { changelog2Query } from "./blog/changelog/changelog2";
import { changelog3Query } from "./blog/changelog/changelog3";
import { changelog5Query } from "./blog/changelog/changelog5";
import { pricing1Query } from "./pricing/pricing1";
import { pricing2Query } from "./pricing/pricing2";
import { pricing7Query } from "./pricing/pricing7";
import { pricing9Query } from "./pricing/pricing9";
import { pricing16Query } from "./pricing/pricing16";
import { team1Query } from "./team/team1";
import { team2Query } from "./team/team2";
import { team3Query } from "./team/team3";
import { team4Query } from "./team/team4";
import { team5Query } from "./team/team5";
import { team6Query } from "./team/team6";
import { team8Query } from "./team/team8";
import { compare1Query } from "./compare/compare1";
import { compare2Query } from "./compare/compare2";
import { compare4Query } from "./compare/compare4";
import { compare5Query } from "./compare/compare5";
import { compare6Query } from "./compare/compare6";
import { gallery1Query } from "./gallery/gallery1";
import { gallery3Query } from "./gallery/gallery3";
import { gallery4Query } from "./gallery/gallery4";
import { gallery8Query } from "./gallery/gallery8";
import { gallery9Query } from "./gallery/gallery9";
import { gallery10Query } from "./gallery/gallery10";
import { timeline3Query } from "./timelines/timeline3";
import { timeline4Query } from "./timelines/timeline4";
import { timeline5Query } from "./timelines/timeline5";
import { timeline6Query } from "./timelines/timeline6";

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    blocks[]{
      ${sectionHeaderQuery},
      ${hero12Query},
      ${hero13Query},
      ${hero25Query},
      ${hero57Query},
      ${hero85Query},
      ${hero160Query},
      ${hero174Query},
      ${faq1Query},
      ${faq5Query},
      ${faq8Query},
      ${faq9Query},
      ${faq14Query},
      ${logos1Query},
      ${logos2Query},
      ${logos4Query},
      ${logos9Query},
      ${feature1Query},
      ${feature3Query},
      ${feature12Query},
      ${feature15Query},
      ${feature66Query},
      ${feature117Query},
      ${feature157Query},
      ${feature202Query},
      ${blog4Query},
      ${allPosts4Query},
      ${blog7Query},
      ${allPosts7Query},
      ${blog13Query},
      ${allPosts13Query},
      ${blog14Query},
      ${allPosts14Query},
      ${blog16Query},
      ${allPosts16Query},
      ${changelog1Query},
      ${changelog2Query},
      ${changelog3Query},
      ${changelog5Query},
      ${pricing1Query},
      ${pricing2Query},
      ${pricing7Query},
      ${pricing9Query},
      ${pricing16Query},
      ${team1Query},
      ${team2Query},
      ${team3Query},
      ${team4Query},
      ${team5Query},
      ${team6Query},
      ${team8Query},
      ${compare1Query},
      ${compare2Query},
      ${compare4Query},
      ${compare5Query},
      ${compare6Query},
      ${gallery1Query},
      ${gallery3Query},
      ${gallery4Query},
      ${gallery8Query},
      ${gallery9Query},
      ${gallery10Query},
      ${timeline3Query},
      ${timeline4Query},
      ${timeline5Query},
      ${timeline6Query},
    },
    ${metaQuery},
  }
`;

export const PAGES_SLUGS_QUERY = groq`*[_type == "page" && defined(slug)]{slug}`;
