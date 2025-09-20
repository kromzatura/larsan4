"use client";

import { useMemo, useState } from "react";
import SectionContainer from "@/components/ui/section-container";
import { SectionPadding } from "@/sanity.types";
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
import AddToInquiryButton from "@/components/inquiry/add-to-inquiry-button";

// Field keys supported for comparison. "actions" renders an inquiry button instead of a value.
type CompareFieldKey =
  | "pungency"
  | "fatContent"
  | "bindingCapacity"
  | "bestFor"
  | "sku"
  | "actions";

interface ProductSpecSubset {
  pungency?: string | number | null;
  fatContent?: string | number | null;
  bindingCapacity?: string | number | null;
  bestFor?: string | null;
  sku?: string | null;
}

interface ProductForCompare {
  _id?: string | null;
  title?: string | null;
  slug?: { current?: string | null } | null;
  spec?: ProductSpecSubset | null;
}

type ColumnOverrides = Partial<ProductSpecSubset>;

interface CompareColumn {
  product?: ProductForCompare | null;
  overrides?: ColumnOverrides | null;
  // Legacy attribute shape fallback (kept narrow / optional)
  attributes?: { value?: string | number | null }[];
}

interface CompareProductsBlockProps {
  padding?: SectionPadding | null; // matches SectionContainer expectations
  title?: string | null;
  productFields?: CompareFieldKey[] | null;
  columns?: CompareColumn[] | null;
}

type CellValue = string | number | null | undefined | "__actions__";

interface NormalizedColumns {
  headers: string[];
  rows: string[]; // row labels
  cols: { values: CellValue[] }[]; // parallel to headers
}

export default function CompareProducts({
  padding,
  title,
  productFields,
  columns,
}: CompareProductsBlockProps) {
  const normalized: NormalizedColumns = useMemo(() => {
    if (!columns || columns.length === 0)
      return { headers: [], rows: [], cols: [] };

    const headers = columns.map((c, idx) => {
      const t = (c?.product?.title || "").trim();
      return t || `Unnamed product ${idx + 1}`;
    });

    const fieldKeys: CompareFieldKey[] = Array.isArray(productFields)
      ? (productFields.filter(Boolean) as CompareFieldKey[])
      : [];

    const rowLabels: string[] = [];
    const valueGetters: ((col: CompareColumn) => CellValue)[] = [];

    fieldKeys.forEach((f) => {
      switch (f) {
        case "pungency":
          rowLabels.push("Pungency/Heat");
          valueGetters.push(
            (c) => c?.overrides?.pungency ?? c?.product?.spec?.pungency
          );
          break;
        case "fatContent":
          rowLabels.push("Fat Content (%)");
          valueGetters.push(
            (c) => c?.overrides?.fatContent ?? c?.product?.spec?.fatContent
          );
          break;
        case "bindingCapacity":
          rowLabels.push("Binding Capacity");
          valueGetters.push(
            (c) =>
              c?.overrides?.bindingCapacity ?? c?.product?.spec?.bindingCapacity
          );
          break;
        case "bestFor":
          rowLabels.push("Best for");
          valueGetters.push(
            (c) => c?.overrides?.bestFor ?? c?.product?.spec?.bestFor
          );
          break;
        case "sku":
          rowLabels.push("SKU");
          valueGetters.push(
            (c) => c?.overrides?.sku ?? c?.product?.spec?.sku
          );
          break;
        case "actions":
          rowLabels.push("Actions");
          valueGetters.push(() => "__actions__");
          break;
        default:
          break; // ignore unknown key
      }
    });

    const cols = columns.map((c) => ({
      values: valueGetters.map((getter) => getter(c)),
    }));

    return { headers, rows: rowLabels, cols };
  }, [columns, productFields]);

  const [selectedTab, setSelectedTab] = useState<string>(
    (normalized.headers && normalized.headers[0]) || "0"
  );

  return (
    <SectionContainer padding={padding}>
  {columns && columns.length > 0 && (
        <Tabs
          defaultValue={(normalized.headers && normalized.headers[0]) || "0"}
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
            {normalized.rows.map((rowLabel, rowIdx) => (
              <TableRow key={rowIdx}>
                <TableCell className="p-5 font-semibold whitespace-normal">
                  {rowLabel}
                </TableCell>
                {normalized.cols.map((c, colIdx) => {
                  // Primary normalized value; fallback to legacy attributes array if present.
                  const legacy = columns?.[colIdx]?.attributes?.[rowIdx]?.value;
                  const v: CellValue = c.values[rowIdx] ?? legacy ?? null;
                  const isAction = v === "__actions__";
                  return (
                    <TableCell
                      key={colIdx}
                      className={cn(
                        "p-5 text-center whitespace-normal md:table-cell",
                        normalized.headers[colIdx] !== selectedTab
                          ? "hidden"
                          : ""
                      )}
                    >
                      {!isAction && (
                        <span className="text-muted-foreground">
                          {String(v ?? "—")}
                        </span>
                      )}
                      {isAction && (
                        <AddToInquiryButton
                          item={{
                            id:
                              String(
                                columns?.[colIdx]?.overrides?.sku ??
                                  columns?.[colIdx]?.product?.spec?.sku ??
                                  columns?.[colIdx]?.product?._id ??
                                  `col-${colIdx}`
                              ),
                            name: columns?.[colIdx]?.product?.title ?? null,
                            productId:
                              columns?.[colIdx]?.product?._id ?? null,
                            slug:
                              columns?.[colIdx]?.product?.slug?.current ?? null,
                            imageUrl: null,
                          }}
                          className="w-full max-w-44 px-6 mx-auto"
                        />
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
