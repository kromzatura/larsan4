"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PostDate from "@/components/post-date";
import { PAGE_QUERYResult, CHANGELOGS_QUERYResult } from "@/sanity.types";
import PortableTextRenderer from "@/components/portable-text-renderer";

type Changelogs5Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "changelog-5" }
>;

export default function Changelog5({
  title,
  secondaryTitle,
  links,
  changelogs,
}: Pick<Changelogs5Props, "title" | "secondaryTitle" | "links"> & {
  changelogs: CHANGELOGS_QUERYResult;
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  useEffect(() => {
    const sections = Object.keys(sectionRefs.current);

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    let observer: IntersectionObserver | null = new IntersectionObserver(
      observerCallback,
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    sections.forEach((sectionId) => {
      const element = sectionRefs.current[sectionId];
      if (element) {
        observer?.observe(element);
      }
    });

    return () => {
      observer?.disconnect();
      observer = null;
    };
  }, []);

  const addSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionRefs.current[id] = ref;
    }
  };

  return (
    <>
      <div className="bg-muted/60 py-20 lg:py-28">
        <div className="container">
          <div className="flex flex-col items-start gap-4 lg:flex-row">
            <span className="flex w-[16%] items-center gap-3 pt-1 text-sm">
              <span className="size-2 shrink-0 rounded-full bg-primary" />
              Changelog
            </span>
            <div>
              {(title || secondaryTitle) && (
                <h2 className="text-4xl font-normal">
                  {title} <br />{" "}
                  <span className="text-muted-foreground">
                    {secondaryTitle}
                  </span>
                </h2>
              )}
              {links && links.length > 0 && (
                <div className="mt-10 flex items-center gap-4 text-sm">
                  {links.map((link) => (
                    <Link
                      key={link._key}
                      href={link.href || "#"}
                      target={link.target ? "_blank" : undefined}
                      rel={link.target ? "noopener" : undefined}
                      className={cn(
                        buttonVariants({
                          variant: link.buttonVariant || "default",
                        }),
                        "p-0"
                      )}
                    >
                      <div className="group flex items-center gap-1 underline">
                        {link.title}
                        <ArrowUpRight className="size-4 transition-all group-hover:rotate-45" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {changelogs && changelogs?.length > 0 && (
        <div className="container mt-10 lg:mt-20">
          <div className="relative flex">
            <div className="sticky top-10 hidden h-fit w-[16%] text-sm lg:block">
              <p className="mb-2">Timeline</p>
              <ul className="flex flex-col gap-2">
                {changelogs.map((changelog, idx) => (
                  <li key={changelog.title}>
                    <a
                      href={`#section-${idx + 1}`}
                      className={cn(
                        "transition-colors duration-200",
                        activeSection === `section-${idx + 1}`
                          ? "font-medium text-primary"
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {changelog.date && <PostDate date={changelog.date} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Separator
              orientation="vertical"
              className="hidden h-auto data-[orientation=vertical]:h-auto lg:block"
            />
            <div className="mx-auto flex max-w-prose flex-col gap-16 lg:gap-24">
              {changelogs.map((changelog, idx) => (
                <div
                  key={changelog._id}
                  id={`section-${idx + 1}`}
                  ref={(ref) => addSectionRef(`section-${idx + 1}`, ref)}
                  className="scroll-m-20"
                >
                  {changelog.image && changelog.image.asset?._id && (
                    <Image
                      src={urlFor(changelog.image).url()}
                      alt={changelog.image.alt || ""}
                      placeholder={
                        changelog.image?.asset?.metadata?.lqip
                          ? "blur"
                          : undefined
                      }
                      blurDataURL={changelog.image?.asset?.metadata?.lqip || ""}
                      className="mb-8 aspect-video w-full object-cover"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      width={
                        changelog.image.asset?.metadata?.dimensions?.width ||
                        700
                      }
                      height={
                        changelog.image.asset?.metadata?.dimensions?.height ||
                        400
                      }
                      quality={100}
                    />
                  )}
                  {changelog.categories && changelog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {changelog.categories.map((category) => (
                        <span
                          key={category._id}
                          className="flex items-center gap-2"
                        >
                          <span className="size-2 shrink-0 rounded-full border border-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {category.title}
                          </p>
                        </span>
                      ))}
                    </div>
                  )}
                  {changelog.title && (
                    <h3 className="mt-2 mb-6 text-3xl">{changelog.title}</h3>
                  )}
                  {changelog.body && (
                    <PortableTextRenderer value={changelog.body} />
                  )}
                  <div className="mt-6 flex items-end justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-4">
                      {changelog.author?.image &&
                        changelog.author.image.asset?._id && (
                          <Avatar className="size-10 border border-border">
                            <AvatarImage
                              src={urlFor(changelog.author.image).url()}
                            />
                          </Avatar>
                        )}
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {changelog.author?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {changelog.author?.title}
                        </p>
                      </div>
                    </div>
                    {changelog.date && (
                      <time className="text-sm text-muted-foreground">
                        <PostDate date={changelog.date} />
                      </time>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
