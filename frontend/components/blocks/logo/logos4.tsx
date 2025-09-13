import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult } from "@/sanity.types";

type Logos4Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "logos-4" }
>;

const Logos4 = ({ padding, images }: Logos4Props) => {
  return (
    <SectionContainer padding={padding}>
      <div className="mx-auto grid max-w-screen-lg grid-cols-2 place-items-center gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
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
            width={144}
            height={80}
            className="grayscale"
          />
        ))}
      </div>
    </SectionContainer>
  );
};

export default Logos4;
