import { describe, expect, test } from 'vitest';
import { previewSurfaces } from '@/lib/demoData';

describe('preview surfaces inventory', () => {
  test('keeps at least one clickable route', () => {
    const clickable = previewSurfaces.filter((item) => item.status === 'clickable');
    expect(clickable.length).toBeGreaterThan(0);
  });

  test('includes backend-only and not-implemented classification', () => {
    expect(previewSurfaces.some((item) => item.status === 'backend_only')).toBe(true);
    expect(previewSurfaces.some((item) => item.status === 'not_implemented')).toBe(true);
  });
});
