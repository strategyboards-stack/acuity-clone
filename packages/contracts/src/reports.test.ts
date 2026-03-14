import { describe, expect, it } from 'vitest';
import type { ReportTab } from './reports';

describe('report contracts', () => {
  it('defines the expected report tabs', () => {
    const tabs: ReportTab[] = [
      'appointments',
      'revenue',
      'users',
      'intakeForms',
      'tips',
    ];

    expect(tabs).toHaveLength(5);
  });
});
