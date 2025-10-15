"use client";

import { cn, toText } from "@/lib/utils";
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
  const [selectedTab, setSelectedTab] = useState(
    toText(columns?.[0]?.name) ?? ""
  );

  return (
    <SectionContainer padding={padding}>
      {columns && columns?.length > 0 && (
        <Tabs
          defaultValue={toText(columns[0].name) || ""}
          onValueChange={setSelectedTab}
          className="mb-6 block md:hidden"
        >
          <TabsList className="w-full">
            {columns.map((column, idx) => {
              const colName = toText(column.name) ?? "";
              return (
                <TabsTrigger key={idx} value={colName}>
                  {colName}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      )}
      <div className="[&>div]:overflow-visible">
        <Table className="table-fixed [&_td]:border [&_th]:border">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 mb-24 w-1/4 bg-background p-5 text-base font-medium text-primary after:absolute after:right-0 after:-bottom-px after:left-0 after:h-px after:bg-border">
                {toText(title) ?? ""}
              </TableHead>
              {columns?.map((column, idx) => {
                const colName = toText(column.name) ?? "";
                return (
                  <TableHead
                    key={idx}
                    className={cn(
                      "sticky top-0 mb-24 w-1/4 bg-background p-5 text-center text-base font-medium text-primary after:absolute after:right-0 after:-bottom-px after:left-0 after:h-px after:bg-border md:table-cell",
                      colName !== selectedTab ? "hidden" : ""
                    )}
                  >
                    {colName}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows?.map((row, rowIdx) => {
              const rowLabel = toText(row) ?? "";
              return (
                <TableRow key={rowIdx}>
                  <TableCell className="p-5 font-semibold whitespace-normal">
                    {rowLabel}
                  </TableCell>
                  {columns?.map((column) => {
                    const colName = toText(column.name) ?? "";
                    const rawVal = column?.attributes?.[rowIdx]
                      ?.value as unknown;
                    const valueText =
                      toText(rawVal) ??
                      (typeof rawVal === "number" || typeof rawVal === "boolean"
                        ? String(rawVal)
                        : typeof rawVal === "string"
                        ? rawVal
                        : "");
                    return (
                      <TableCell
                        key={column._key}
                        className={cn(
                          "p-5 text-center whitespace-normal md:table-cell",
                          colName !== selectedTab ? "hidden" : ""
                        )}
                      >
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          {column?.attributes?.[rowIdx]?.status ===
                            "positive" && (
                            <span className="flex size-8 items-center justify-center rounded-full border border-green-200 bg-green-100">
                              <CircleCheck className="size-4 text-green-700" />
                            </span>
                          )}
                          {column?.attributes?.[rowIdx]?.status ===
                            "negative" && (
                            <span className="flex size-8 items-center justify-center rounded-full border border-red-200 bg-red-100">
                              <CircleX className="size-4 text-red-700" />
                            </span>
                          )}
                          {column?.attributes?.[rowIdx]?.status ===
                            "neutral" && (
                            <span className="flex size-8 items-center justify-center rounded-full border border-amber-200 bg-amber-100">
                              <CircleMinus className="size-4 text-amber-700" />
                            </span>
                          )}

                          {valueText}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}
