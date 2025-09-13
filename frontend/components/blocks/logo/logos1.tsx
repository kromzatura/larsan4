import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity.types";

type Logos1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "logos-1" }
>;

const Logos1 = ({ padding, title, images }: Logos1Props) => {
  return (
    <SectionContainer padding={padding}>
      <div className="flex flex-wrap items-center justify-between gap-12">
        {title && (
          <p className="text-lg leading-[140%] tracking-[-0.32px] text-primary">
            {title}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-6 opacity-70 grayscale lg:gap-[60px]">
          {images?.map((image) => (
            <Image
              key={image._key}
              src={urlFor(image).url()}
              alt={image.alt || ""}
              placeholder={
                image?.asset?.metadata?.lqip &&
                image?.asset?.mimeType !== "image/svg+xml"
                  ? "blur"
                  : undefined
              }
              blurDataURL={image?.asset?.metadata?.lqip || ""}
              width={109}
              height={48}
              className="object-contain"
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default Logos1;
