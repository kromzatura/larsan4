"use client";

import { useMemo, useState } from "react";
import SectionContainer from "@/components/ui/section-container";
// Using loose typing because typegen doesn't yet include this new block
import { PAGE_QUERYResult } from "@/sanity.types";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheck, CircleMinus, CircleX } from "lucide-react";

type BlockProps = any;

export default function CompareProducts({
  padding,
  title,
  mode,
  productFields,
  rows,
  columns,
}: BlockProps) {
  const isProduct = mode !== "freeform";

  const normalized = useMemo(() => {
    if (!columns) return { headers: [], rows: [], cols: [] };

  const headers = (columns as any[]).map((c: any) =>
      (c?.overrides?.name || c?.name || c?.product?.title || "").trim()
    );

    if (!isProduct) {
      return {
        headers,
        rows: rows || [],
  cols: (columns as any[]).map((c: any) => ({ attributes: c.attributes || [] })),
      };
    }

  const fields: string[] = productFields && (productFields as any[]).length > 0 ? (productFields as string[]) : [];

    const rowLabels: string[] = [];
    const valueGetters: ((col: any) => string | number | undefined)[] = [];

    fields.forEach((f) => {
      switch (f) {
        case "pungency":
          rowLabels.push("Pungency/Heat");
          valueGetters.push((c) => c?.overrides?.pungency ?? c?.product?.specifications?.pungency);
          break;
        case "fatContent":
          rowLabels.push("Fat Content (%)");
          valueGetters.push((c) => c?.overrides?.fatContent ?? c?.product?.specifications?.fatContent);
          break;
        case "bindingCapacity":
          rowLabels.push("Binding Capacity");
          valueGetters.push((c) => c?.overrides?.bindingCapacity ?? c?.product?.specifications?.bindingCapacity);
          break;
        case "bestFor":
          rowLabels.push("Best for");
          valueGetters.push((c) => c?.overrides?.bestFor ?? c?.product?.specifications?.bestFor);
          break;
        case "sku":
          rowLabels.push("SKU");
          valueGetters.push((c) => c?.overrides?.sku ?? c?.product?.specifications?.sku);
          break;
        case "actions":
          rowLabels.push("Actions");
          valueGetters.push(() => "__actions__");
          break;
        default:
          break;
      }
    });

    const cols = (columns as any[]).map((c: any) => ({
      values: valueGetters.map((getter) => getter(c)),
    }));

    return { headers, rows: rowLabels, cols };
  }, [columns, isProduct, productFields, rows]);

  const [selectedTab, setSelectedTab] = useState<string>(normalized.headers?.[0] || "");

  return (
    <SectionContainer padding={padding}>
  {columns && (columns as any[])?.length > 0 && (
        <Tabs
          defaultValue={normalized.headers?.[0] || ""}
          onValueChange={setSelectedTab}
          className="mb-6 block md:hidden"
        >
          <TabsList className="w-full">
            {normalized.headers.map((h, idx) => (
              <TabsTrigger key={idx} value={h}>
                {h}
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
              {normalized.headers.map((header, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    "sticky top-0 mb-24 w-1/4 bg-background p-5 text-center text-base font-medium text-primary after:absolute after:right-0 after:-bottom-px after:left-0 after:h-px after:bg-border md:table-cell",
                    header !== selectedTab ? "hidden" : ""
                  )}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {normalized.rows?.map((rowLabel: string, rowIdx: number) => (
              <TableRow key={rowIdx}>
                <TableCell className="p-5 font-semibold whitespace-normal">
                  {rowLabel}
                </TableCell>
                {normalized.cols.map((c, colIdx) => {
                  const v = (c as any).values ? (c as any).values[rowIdx] : (columns?.[colIdx] as any)?.attributes?.[rowIdx]?.value;
                  const status = (columns?.[colIdx] as any)?.attributes?.[rowIdx]?.status;

                  const isAction = v === "__actions__";
                  return (
                    <TableCell
                      key={colIdx}
                      className={cn(
                        "p-5 text-center whitespace-normal md:table-cell",
                        normalized.headers[colIdx] !== selectedTab ? "hidden" : ""
                      )}
                    >
                      {!isProduct && (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          {status === "positive" && (
                            <span className="flex size-8 items-center justify-center rounded-full border border-green-200 bg-green-100">
                              <CircleCheck className="size-4 text-green-700" />
                            </span>
                          )}
                          {status === "negative" && (
                            <span className="flex size-8 items-center justify-center rounded-full border border-red-200 bg-red-100">
                              <CircleX className="size-4 text-red-700" />
                            </span>
                          )}
                          {status === "neutral" && (
                            <span className="flex size-8 items-center justify-center rounded-full border border-amber-200 bg-amber-100">
                              <CircleMinus className="size-4 text-amber-700" />
                            </span>
                          )}
                          {String(v ?? "")}
                        </div>
                      )}
                      {isProduct && !isAction && <span className="text-muted-foreground">{String(v ?? "—")}</span>}
                      {isProduct && isAction && (
                        <div>
                          {/* Placeholder: you can wire a CTA/inquiry button here later */}
                          <span className="text-sm text-muted-foreground">Contact us</span>
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}
