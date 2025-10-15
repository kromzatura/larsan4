import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Feature12 from "@/components/blocks/feature/feature12/index";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    prefetch: () => Promise.resolve(),
  }),
}));

describe("SSR safety for products-related components", () => {
  it("renders ProductsTable with object-like values safely", async () => {
    const { default: ProductsTable } = await import(
      "@/components/products/products-table"
    );
    const items: any[] = [
      {
        _id: "1",
        slug: "prod-1",
        title: { _key: "a", _type: "text", value: "Product One" } as any,
        sku: { _key: "s", _type: "text", value: "SKU-001" } as any,
        imageUrl: "https://picsum.photos/seed/p1/320/213",
        imageMeta: { lqip: null, dimensions: { width: 320, height: 213 } },
        features: [
          { _key: "f1", _type: "text", value: "Feature A" } as any,
          { _key: "f2", _type: "text", value: "Feature B" } as any,
        ] as any,
        productAttributes: { _key: "pa", _type: "text", value: "Attr" } as any,
        purity: { _key: "pu", _type: "text", value: "99%" } as any,
        categories: [
          {
            _id: "c1",
            title: { _key: "ct1", _type: "text", value: "Cat" } as any,
            slug: "cat",
            href: "/en/products/category/cat",
          },
        ],
        href: "/en/products/prod-1",
      },
    ];

    const html = renderToString(
      // locale defaults internally
      <ProductsTable
        labels={{
          headerProduct: "Product",
          headerCategory: "Category",
          headerKeyFeatures: "Key features",
          headerAttributes: "Attributes",
          headerAction: "Action",
          labelSku: "SKU",
          labelPurity: "Purity",
          emptyState: "No products",
        }}
        items={items}
        page={1}
        pageCount={1}
        baseUrl="/en/products"
      />
    );
    expect(html).toBeTypeOf("string");
    expect(html).not.toContain("[object Object]");
  });

  it("renders Feature12 with object-like tagline safely", () => {
    const html = renderToString(
      <Feature12
        {...({
          _type: "feature-12",
          _key: "test",
          padding: null,
          tagline: { _key: "t", _type: "text", value: "Hot deals" },
          columns: [
            {
              _type: "feature-12-card",
              _key: "k1",
              iconVariant: "none",
              title: { _key: "ct", _type: "text", value: "Column" } as any,
              description: {
                _key: "cd",
                _type: "text",
                value: "Description",
              } as any,
            } as any,
          ],
        } as any)}
      />
    );
    expect(html).toBeTypeOf("string");
    expect(html).not.toContain("[object Object]");
  });
});
