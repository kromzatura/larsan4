"use client";

import { useMemo, useState, type CSSProperties } from "react";
import SectionContainer from "@/components/ui/section-container";
import { SectionPadding } from "@/sanity.types";
import { cn, toText } from "@/lib/utils";
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
}: CompareProductsBlockProps & {
  locale?: import("@/lib/i18n/config").SupportedLocale;
}) {
  const normalized: NormalizedColumns = useMemo(() => {
    if (!columns || columns.length === 0)
      return { headers: [], rows: [], cols: [] };

    const headers = columns.map((c, idx) => {
      const rawTitle = c?.product?.title as unknown;
      const t = (toText(rawTitle) ?? "").trim();
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
          valueGetters.push((c) => c?.overrides?.sku ?? c?.product?.spec?.sku);
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

  const cssVars = {
    "--compare-cols": String(normalized.headers.length || 1),
  };

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
      <div
        className="overflow-x-auto rounded-lg border bg-card shadow-sm"
        style={cssVars as CSSProperties}
      >
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th
                scope="col"
                className="w-48 px-6 py-4 text-left align-top font-semibold text-primary"
              >
                {toText(title) ?? title ?? "Attributes"}
              </th>
              {normalized.headers.map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={cn(
                    "px-6 py-4 text-left font-semibold text-primary md:table-cell",
                    header !== selectedTab ? "hidden" : ""
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {normalized.rows.map((rowLabel, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  "border-t",
                  rowIdx % 2 === 0 ? "even:bg-muted/30" : undefined
                )}
              >
                <td className="w-48 px-6 py-5 md:py-6 align-top font-medium text-muted-foreground/90 whitespace-normal">
                  {toText(rowLabel) ?? rowLabel}
                </td>
                {normalized.cols.map((c, colIdx) => {
                  const legacy = columns?.[colIdx]?.attributes?.[rowIdx]?.value;
                  const v: CellValue = c.values[rowIdx] ?? legacy ?? null;
                  const isAction = v === "__actions__";
                  return (
                    <td
                      key={colIdx}
                      className={cn(
                        "px-6 py-5 md:py-6 text-left align-top whitespace-normal md:table-cell",
                        normalized.headers[colIdx] !== selectedTab
                          ? "hidden"
                          : ""
                      )}
                    >
                      {!isAction && (
                        <span
                          className={cn(
                            "break-words",
                            rowLabel === "SKU"
                              ? "font-mono text-xs md:text-sm"
                              : "text-muted-foreground"
                          )}
                        >
                          {String(v ?? "—")}
                        </span>
                      )}
                      {isAction && (
                        <AddToInquiryButton
                          item={{
                            id: String(
                              columns?.[colIdx]?.overrides?.sku ??
                                columns?.[colIdx]?.product?.spec?.sku ??
                                columns?.[colIdx]?.product?._id ??
                                `col-${colIdx}`
                            ),
                            name:
                              toText(columns?.[colIdx]?.product?.title) ?? null,
                            productId: columns?.[colIdx]?.product?._id ?? null,
                            slug:
                              columns?.[colIdx]?.product?.slug?.current ?? null,
                            imageUrl: null,
                          }}
                          className="w-full max-w-40 mx-auto text-xs md:text-sm py-2 px-3"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionContainer>
  );
}
