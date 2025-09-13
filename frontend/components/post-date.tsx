"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/formatDate";

export default function PostDate({ date }: { date: string }) {
  const [postDate, setPostDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (date) {
      const formattedDate = formatDate(date);
      setPostDate(formattedDate);
      setIsLoading(false);
    }
  }, [date]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-24 bg-gray-200"></div>
      </div>
    );
  }

  return <div>{postDate}</div>;
}
