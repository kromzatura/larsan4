import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';

import Compare6 from '@/components/blocks/compare/compare6';
import CompareProducts from '@/components/blocks/compare/compare-products';
import Compare4 from '@/components/blocks/compare/compare4';
import type { PAGE_QUERYResult } from '@/sanity.types';

function ssrSafe(element: React.ReactElement) {
  let html = '';
  let error: unknown = null;
  try {
    html = renderToString(element);
  } catch (e) {
    error = e;
  }
  return { html, error };
}

// SectionPadding in code is treated as boolean top/bottom
const padding: NonNullable<
  Extract<NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number], { _type: 'compare-6' }>
>['padding'] = {
  top: false,
  bottom: false,
};

describe('SSR safety for compare blocks', () => {
  it('Compare6 should not throw with object-like values', () => {
    const props: Extract<
      NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
      { _type: 'compare-6' }
    > = {
      _type: 'compare-6',
      _key: 'k1',
      padding,
      title: { _type: 'localeString', value: 'Specs' } as any,
      rows: [
        { _type: 'label', value: 'Row A' } as any,
        { _type: 'label', value: 'Row B' } as any,
      ] as any,
      columns: [
        {
          _key: 'c1',
          name: { _type: 'localeString', value: 'Left' } as any,
          attributes: [
            { value: { _type: 'text', value: 'Alpha' } as any, status: 'positive' },
            { value: { _type: 'text', value: 'Beta' } as any, status: 'neutral' },
          ] as any,
        } as any,
        {
          _key: 'c2',
          name: { _type: 'localeString', value: 'Right' } as any,
          attributes: [
            { value: { _type: 'text', value: 'Gamma' } as any, status: 'negative' },
            { value: 123 as any, status: 'neutral' },
          ] as any,
        } as any,
      ],
    } as any;

    const { html, error } = ssrSafe(<Compare6 {...(props as any)} />);
    expect(error).toBeNull();
    expect(html).not.toContain('[object Object]');
    expect(html).toContain('Alpha');
    expect(html).toContain('Beta');
    expect(html).toContain('Gamma');
    expect(html).toContain('123');
  });

  it('CompareProducts coerces titles and SKU safely', () => {
    const props: React.ComponentProps<typeof CompareProducts> = {
      padding,
      title: { _type: 'localeString', value: 'Compare' } as any,
      productFields: ['sku', 'bestFor', 'actions'],
      columns: [
        {
          product: {
            _id: 'p1',
            title: { _type: 'localeString', value: 'Mustard Flour' } as any,
            slug: { current: 'mustard-flour' },
            spec: {
              sku: { _type: 'code', value: 'MF-001' } as any,
              bestFor: { _type: 'text', value: 'Sauces' } as any,
            },
          },
        },
        {
          overrides: {
            sku: { _type: 'code', value: 'ALT-002' } as any as any,
            bestFor: { _type: 'text', value: 'Dressings' } as any as any,
          },
          product: {
            _id: 'p2',
            title: { _type: 'localeString', value: 'Mustard Powder' } as any,
            slug: { current: 'mustard-powder' },
            spec: {},
          },
        },
      ],
    } as any;

    const { html, error } = ssrSafe(<CompareProducts {...(props as any)} />);
    expect(error).toBeNull();
    expect(html).toContain('Mustard Flour');
    expect(html).toContain('Mustard Powder');
    expect(html).toContain('MF-001');
    expect(html).toContain('ALT-002');
    expect(html).not.toContain('[object Object]');
  });

  it('Compare4 link titles and body safe', () => {
    const props: Extract<
      NonNullable<NonNullable<PAGE_QUERYResult>['blocks']>[number],
      { _type: 'compare-4' }
    > = {
      _type: 'compare-4',
      _key: 'cmp4',
      padding,
      title: { _type: 'localeString', value: 'Numbers' } as any,
      titles: { primary: 'Ours', secondary: 'Theirs' } as any,
      columns: [
        {
          _key: 'r1',
          title: { _type: 'localeString', value: 'Protein' } as any,
          primary: { value: { _type: 'num', value: '20' } as any, unit: 'g' },
          secondary: { value: 15 as any, unit: 'g' },
        } as any,
      ],
      body: [] as any,
      links: [
        { _key: 'l1', title: { _type: 'localeString', value: 'Learn More' } as any },
      ] as any,
    } as any;

    const { html, error } = ssrSafe(<Compare4 {...(props as any)} />);
    expect(error).toBeNull();
    expect(html).toContain('Learn More');
    expect(html).not.toContain('[object Object]');
  });
});
