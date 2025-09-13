"use client";

import { useState, useEffect } from "react";
import { BANNER_QUERYResult } from "@/sanity.types";

type BannerData = BANNER_QUERYResult[0];

interface BannerProps {
  data: BannerData;
  component: React.ComponentType<BannerUIProps>;
  bannerId?: string; // Optional ID for different banner types
}

export interface BannerUIProps {
  data: BannerData;
  isVisible: boolean;
  onClose: () => void;
}

// Create a content-based version identifier for the banner
function createBannerVersion(banner: BannerData, bannerId: string): string {
  // Create a simple hash of the banner's content to detect changes
  const contentString = JSON.stringify({
    title: banner.title,
    description: banner.description,
    link: banner.link,
  });

  let hash = 0;
  for (let i = 0; i < contentString.length; i++) {
    const char = contentString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `${bannerId}_v${hash}`;
}

export default function Banner({
  data,
  component: UIComponent,
  bannerId = "banner",
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Initialize visibility based on localStorage
  useEffect(() => {
    const closedBanners: Record<string, boolean> = JSON.parse(
      localStorage.getItem("closedBanners") || "{}"
    );

    // Create version identifier for current banner content
    const currentBannerVersion = createBannerVersion(data, bannerId);

    // Cleanup: Remove old banner versions that no longer match current content
    let hasCleanup = false;
    const cleanedClosedBanners: Record<string, boolean> = {};

    for (const [versionKey, value] of Object.entries(closedBanners)) {
      // Extract banner ID from version key (before "_v")
      const storedBannerId = versionKey.split("_v")[0];

      // Keep if this is a different banner OR if it matches the current version
      if (storedBannerId !== bannerId || versionKey === currentBannerVersion) {
        cleanedClosedBanners[versionKey] = value;
      } else {
        hasCleanup = true;
      }
    }

    // Update localStorage if we cleaned anything up
    if (hasCleanup) {
      localStorage.setItem(
        "closedBanners",
        JSON.stringify(cleanedClosedBanners)
      );
    }

    // Show banner if this specific version hasn't been closed
    const shouldShow = !cleanedClosedBanners[currentBannerVersion];
    setIsVisible(shouldShow);
  }, [data, bannerId]);

  const handleClose = () => {
    setIsVisible(false);

    // Update localStorage with the specific banner version
    const closedBanners: Record<string, boolean> = JSON.parse(
      localStorage.getItem("closedBanners") || "{}"
    );

    const bannerVersion = createBannerVersion(data, bannerId);
    closedBanners[bannerVersion] = true;
    localStorage.setItem("closedBanners", JSON.stringify(closedBanners));
  };

  return (
    <UIComponent data={data} isVisible={isVisible} onClose={handleClose} />
  );
}
