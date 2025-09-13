"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      className="p-2 transition-colors hover:bg-white group"
      onClick={copy}
      aria-label="Copy code"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-background group-hover:text-foreground" />
      ) : (
        <Copy className="h-4 w-4 text-background group-hover:text-foreground" />
      )}
    </button>
  );
}
