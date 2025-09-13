import { ImageResponse } from "next/og";
import {
  fetchSanityPostBySlug,
  fetchSanityPageBySlug,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";

async function getTtfFont(
  family: string,
  axes: string[],
  value: number[]
): Promise<ArrayBuffer> {
  const familyParam = `${axes.join(",")}@${value.join(",")}`;
  // Get css style sheet with user agent Mozilla/5.0 Firefox/1.0 to ensure non-variable TTF is returned
  const cssCall = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:${familyParam}&display=swap`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 Firefox/1.0",
      },
    }
  );
  const css = await cssCall.text();
  const ttfUrl = css.match(/url\(([^)]+)\)/)?.[1];
  if (!ttfUrl) {
    throw new Error("Failed to extract font URL from CSS");
  }
  return await fetch(ttfUrl).then((res) => res.arrayBuffer());
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400 });
    }

    const post = await fetchSanityPostBySlug({ slug });
    const page = await fetchSanityPageBySlug({ slug });
    const settings = await fetchSanitySettings();

    if (!post && !page) {
      return new Response("Post or page not found", { status: 404 });
    }

    // Load fonts with different weights
    const [fontRegular, fontBold] = await Promise.all([
      getTtfFont("Inter", ["wght"], [400]),
      getTtfFont("Inter", ["wght"], [700]),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            padding: "64px",
            fontFamily: "Inter",
          }}
        >
          {/* Logo */}
          {settings?.logo && settings.logo.asset?.url && (
            <img
              src={settings.logo.asset.url}
              alt={settings.logo.alt || ""}
              width={300}
              height={42}
              style={{ marginBottom: 48 }}
            />
          )}

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: "bold",
                lineHeight: 1.1,
                color: "#000000",
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post?.title || page?.meta?.title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 32,
                color: "#666666",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post?.meta?.description || page?.meta?.description}
            </div>
          </div>

          {/* Author Info - Only show for posts */}
          {post?.author && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: "auto",
              }}
            >
              {post.author.image && post.author.image.asset?._id && (
                <img
                  src={urlFor(post.author.image)
                    .format("jpg")
                    .width(48)
                    .height(48)
                    .fit("crop")
                    .url()}
                  alt={post.author.name || ""}
                  width="48"
                  height="48"
                  style={{
                    borderRadius: "50%",
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {post.author.name && (
                  <div style={{ fontWeight: 500 }}>{post.author.name}</div>
                )}
                <div style={{ color: "#666666" }}>
                  {new Date(post._createdAt as string).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontRegular,
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: fontBold,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
