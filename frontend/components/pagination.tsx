import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  createPageUrl: (pageNum: number) => string;
  className?: string;
}

// Helper function to generate visible page numbers
const getVisiblePages = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
};

export default function Pagination({
  currentPage,
  totalPages,
  createPageUrl,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {currentPage > 1 && (
        <Link
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
          href={createPageUrl(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {getVisiblePages(currentPage, totalPages).map((pageNum, idx) =>
        pageNum === "..." ? (
          <div key={`dots-${idx}`} className="px-2 flex items-center">
            ...
          </div>
        ) : (
          <Link
            key={pageNum}
            className={buttonVariants({
              variant: pageNum === currentPage ? "default" : "outline",
              size: "icon",
            })}
            href={createPageUrl(pageNum as number)}
          >
            {pageNum}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
          href={createPageUrl(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
