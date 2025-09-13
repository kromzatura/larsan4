import { type SchemaTypeDefinition } from "sanity";
// documents
import page from "./schemas/documents/page";
import post from "./schemas/documents/post";
import author from "./schemas/documents/author";
import category from "./schemas/documents/category";
import faq from "./schemas/documents/faq";
import testimonial from "./schemas/documents/testimonial";
import navigation from "./schemas/documents/navigation";
import settings from "./schemas/documents/settings";
import contact from "./schemas/documents/contact";
import changelog from "./schemas/documents/changelog";
import team from "./schemas/documents/team";
import banner from "./schemas/documents/banner";

// Schema UI shared objects
import blockContent from "./schemas/blocks/shared/block-content";
import link from "./schemas/blocks/shared/link";
import linkIcon from "./schemas/blocks/shared/link-icon";
import linkGroup from "./schemas/blocks/shared/link-group";
import { buttonVariant } from "./schemas/blocks/shared/button-variant";
import sectionPadding from "./schemas/blocks/shared/section-padding";
// Schema UI objects
import sectionHeader from "./schemas/blocks/section-header";
import hero12 from "./schemas/blocks/hero/hero12";
import hero13 from "./schemas/blocks/hero/hero13";
import hero25 from "./schemas/blocks/hero/hero25";
import hero57 from "./schemas/blocks/hero/hero57";
import hero85 from "./schemas/blocks/hero/hero85";
import hero160 from "./schemas/blocks/hero/hero160";
import hero174 from "./schemas/blocks/hero/hero174";
import faq1 from "./schemas/blocks/faq/faq1";
import faq5 from "./schemas/blocks/faq/faq5";
import faq8 from "./schemas/blocks/faq/faq8";
import faq9 from "./schemas/blocks/faq/faq9";
import faq14 from "./schemas/blocks/faq/faq14";
import logos1 from "./schemas/blocks/logos/logos1";
import logos2 from "./schemas/blocks/logos/logos2";
import logos4 from "./schemas/blocks/logos/logos4";
import logos9 from "./schemas/blocks/logos/logos9";
// Feature 1
import feature1 from "./schemas/blocks/feature/feature1";
import featureContent from "./schemas/blocks/feature/feature1/feature-content";
import featureImage from "./schemas/blocks/feature/feature1/feature-image";
// Feature 3
import feature3 from "./schemas/blocks/feature/feature3";
import feature3Card from "./schemas/blocks/feature/feature3/feature3-card";
// Feature 12
import feature12 from "./schemas/blocks/feature/feature12";
import feature12Card from "./schemas/blocks/feature/feature12/feature12-card";
// Feature 15
import feature15 from "./schemas/blocks/feature/feature15";
import feature15Card from "./schemas/blocks/feature/feature15/feature15-card";
// Feature 66
import feature66 from "./schemas/blocks/feature/feature66";
import feature66Card from "./schemas/blocks/feature/feature66/feature66-card";
// Feature 117
import feature117 from "./schemas/blocks/feature/feature117";
import feature117Card from "./schemas/blocks/feature/feature117/feature117-card";
// Feature 157
import feature157 from "./schemas/blocks/feature/feature157";
import feature157Card from "./schemas/blocks/feature/feature157/feature157-card";
// Feature 202
import feature202 from "./schemas/blocks/feature/feature202";
import feature202Card from "./schemas/blocks/feature/feature202/feature202-card";
// Blog 4
import blog4 from "./schemas/blocks/blog/blog4";
import allPosts4 from "./schemas/blocks/blog/blog4/all-posts";
// Blog 7
import blog7 from "./schemas/blocks/blog/blog7";
import allPosts7 from "./schemas/blocks/blog/blog7/all-posts";
// Blog 13
import blog13 from "./schemas/blocks/blog/blog13";
import allPosts13 from "./schemas/blocks/blog/blog13/all-posts";
// Blog 14
import blog14 from "./schemas/blocks/blog/blog14";
import allPosts14 from "./schemas/blocks/blog/blog14/all-posts";
// Blog 16
import blog16 from "./schemas/blocks/blog/blog16";
import allPosts16 from "./schemas/blocks/blog/blog16/all-posts";
// Changelog
import changelog1 from "./schemas/blocks/changelog/changelog1";
import changelog2 from "./schemas/blocks/changelog/changelog2";
import changelog3 from "./schemas/blocks/changelog/changelog3";
import changelog5 from "./schemas/blocks/changelog/changelog5";
// Pricing
import pricing1 from "./schemas/blocks/pricing/pricing1";
import pricing2 from "./schemas/blocks/pricing/pricing2";
import pricing7 from "./schemas/blocks/pricing/pricing7";
import pricing9 from "./schemas/blocks/pricing/pricing9";
import pricing16 from "./schemas/blocks/pricing/pricing16";
// Team
import team1 from "./schemas/blocks/team/team1";
import team2 from "./schemas/blocks/team/team2";
import team3 from "./schemas/blocks/team/team3";
import team4 from "./schemas/blocks/team/team4";
import team5 from "./schemas/blocks/team/team5";
import team6 from "./schemas/blocks/team/team6";
import team8 from "./schemas/blocks/team/team8";
// Compare
import compare1 from "./schemas/blocks/compare/compare1";
import compare2 from "./schemas/blocks/compare/compare2";
import compare4 from "./schemas/blocks/compare/compare4";
import compare5 from "./schemas/blocks/compare/compare5";
import compare6 from "./schemas/blocks/compare/compare6";
// Gallery
import gallery1 from "./schemas/blocks/gallery/gallery1";
import gallery3 from "./schemas/blocks/gallery/gallery3";
import gallery4 from "./schemas/blocks/gallery/gallery4";
import gallery8 from "./schemas/blocks/gallery/gallery8";
import gallery9 from "./schemas/blocks/gallery/gallery9";
import gallery10 from "./schemas/blocks/gallery/gallery10";
// Timeline
import timeline3 from "./schemas/blocks/timelines/timeline3";
import timeline4 from "./schemas/blocks/timelines/timeline4";
import timeline5 from "./schemas/blocks/timelines/timeline5";
import timeline6 from "./schemas/blocks/timelines/timeline6";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    page,
    post,
    author,
    category,
    faq,
    testimonial,
    navigation,
    settings,
    contact,
    changelog,
    team,
    banner,
    // shared objects
    blockContent,
    link,
    linkIcon,
    linkGroup,
    buttonVariant,
    sectionPadding,
    // blocks
    sectionHeader,
    hero12,
    hero13,
    hero25,
    hero57,
    hero85,
    hero160,
    hero174,
    faq1,
    faq5,
    faq8,
    faq9,
    faq14,
    logos1,
    logos2,
    logos4,
    logos9,
    // Feature 1
    feature1,
    featureContent,
    featureImage,
    // Feature 3
    feature3,
    feature3Card,
    // Feature 12
    feature12,
    feature12Card,
    // Feature 15
    feature15,
    feature15Card,
    // Feature 66
    feature66,
    feature66Card,
    // Feature 117
    feature117,
    feature117Card,
    // Feature 157
    feature157,
    feature157Card,
    // Feature 202
    feature202,
    feature202Card,
    // Blog 4
    blog4,
    allPosts4,
    // Blog 7
    blog7,
    allPosts7,
    // Blog 13
    blog13,
    allPosts13,
    // Blog 14
    blog14,
    allPosts14,
    // Blog 16
    blog16,
    allPosts16,
    // Changelog
    changelog1,
    changelog2,
    changelog3,
    changelog5,
    // Pricing
    pricing1,
    pricing2,
    pricing7,
    pricing9,
    pricing16,
    // Team
    team1,
    team2,
    team3,
    team4,
    team5,
    team6,
    team8,
    // Compare
    compare1,
    compare2,
    compare4,
    compare5,
    compare6,
    // Gallery
    gallery1,
    gallery3,
    gallery4,
    gallery8,
    gallery9,
    gallery10,
    // Timeline
    timeline3,
    timeline4,
    timeline5,
    timeline6,
  ],
};
