"use client";

import { cn } from "@/lib/utils";
import { CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionContainer from "@/components/ui/section-container";
import { PAGE_QUERYResult } from "@/sanity.types";

type Compare6Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "compare-6" }
>;

export default function Compare6({
  padding,
  title,
  rows,
  columns,
}: Compare6Props) {
  const [selectedTab, setSelectedTab] = useState(columns?.[0].name);

  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <Tabs
          defaultValue={columns[0].name || ""}
          onValueChange={setSelectedTab}
          className="mb-6 block md:hidden"
        >
          <TabsList className="w-full">
            {columns.map((column, idx) => (
              <TabsTrigger key={idx} value={column.name || ""}>
                {column.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      <div className="[&>div]:overflow-visible">
        <Table className="table-fixed [&_td]:border [&_th]:border">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 mb-24 w-1/4 bg-background p-5 text-base font-medium text-primary after:absolute after:right-0 after:-bottom-px after:left-0 after:h-px after:bg-border">
                {title}
              </TableHead>
              {columns?.map((column, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    "sticky top-0 mb-24 w-1/4 bg-background p-5 text-center text-base font-medium text-primary after:absolute after:right-0 after:-bottom-px after:left-0 after:h-px after:bg-border md:table-cell",
                    column.name !== selectedTab ? "hidden" : ""
                  )}
                >
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows?.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                <TableCell className="p-5 font-semibold whitespace-normal">
                  {row}
                </TableCell>
                {columns?.map((column) => (
                  <TableCell
                    key={column._key}
                    className={cn(
                      "p-5 text-center whitespace-normal md:table-cell",
                      column.name !== selectedTab ? "hidden" : ""
                    )}
                  >
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      {column?.attributes?.[rowIdx]?.status === "positive" && (
                        <span className="flex size-8 items-center justify-center rounded-full border border-green-200 bg-green-100">
                          <CircleCheck className="size-4 text-green-700" />
                        </span>
                      )}
                      {column?.attributes?.[rowIdx]?.status === "negative" && (
                        <span className="flex size-8 items-center justify-center rounded-full border border-red-200 bg-red-100">
                          <CircleX className="size-4 text-red-700" />
                        </span>
                      )}
                      {column?.attributes?.[rowIdx]?.status === "neutral" && (
                        <span className="flex size-8 items-center justify-center rounded-full border border-amber-200 bg-amber-100">
                          <CircleMinus className="size-4 text-amber-700" />
                        </span>
                      )}

                      {column?.attributes?.[rowIdx]?.value}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}
