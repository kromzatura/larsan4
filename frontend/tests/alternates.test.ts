import { describe, it, expect } from 'vitest';
import { buildAlternatesLanguages } from '@/lib/alternates';

describe('buildAlternatesLanguages', () => {
  it('returns undefined for empty or invalid input', () => {
    expect(buildAlternatesLanguages('index', undefined)).toBeUndefined();
    expect(buildAlternatesLanguages('index', [])).toBeUndefined();
  });

  it('builds language map with index slug', () => {
    const res = buildAlternatesLanguages('index', [
      { language: 'en', slug: 'index' },
      { language: 'nl', slug: 'index' },
    ]);
    expect(res).toEqual({ en: '/en', nl: '/nl' });
  });

  it('builds language map for non-index slugs', () => {
    const res = buildAlternatesLanguages('about', [
      { language: 'en', slug: 'about' },
      { language: 'nl', slug: 'over' },
    ]);
    expect(res).toEqual({ en: '/en/about', nl: '/nl/over' });
  });
});
