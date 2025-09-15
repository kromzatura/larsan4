"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getInquiryList,
  INQUIRY_UPDATED_EVENT,
  type InquiryItem,
} from "@/lib/inquiry";

type InquiryContextType = {
  items: InquiryItem[];
  count: number;
};

const InquiryContext = createContext<InquiryContextType>({
  items: [],
  count: 0,
});

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [inquiryState, setInquiryState] = useState<InquiryContextType>({
    items: [],
    count: 0,
  });

  useEffect(() => {
    const initialItems = getInquiryList();
    setInquiryState({ items: initialItems, count: initialItems.length });

    const handleInquiryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ items: InquiryItem[]; count: number }>;
      setInquiryState(customEvent.detail);
    };

    window.addEventListener(INQUIRY_UPDATED_EVENT, handleInquiryUpdate as EventListener);
    return () => {
      window.removeEventListener(INQUIRY_UPDATED_EVENT, handleInquiryUpdate as EventListener);
    };
  }, []);

  return <InquiryContext.Provider value={inquiryState}>{children}</InquiryContext.Provider>;
}

export function useInquiry() {
  return useContext(InquiryContext);
}
