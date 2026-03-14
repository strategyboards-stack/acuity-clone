import { describe, expect, it } from 'vitest';
import { buildReportDataset } from '@/lib/reporting/dataset';
import { evaluateReportsGate } from '@/lib/gating/reports-gating';

const filters = {
  calendarIds: ['cal-1'],
  dateRange: {
    preset: 'last30Days' as const,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  },
};

describe('reports foundation', () => {
  it('returns intake forms empty state before question selection', () => {
    const dataset = buildReportDataset('intakeForms', filters, { submitted: false });
    expect(dataset.requiresQuestionSelection).toBe(true);
    expect(dataset.isEmpty).toBe(true);
  });

  it('keeps tips empty-state tolerant', () => {
    const dataset = buildReportDataset('tips', filters);
    expect(dataset.isEmpty).toBe(true);
    expect(dataset.rows).toHaveLength(0);
  });

  it('enforces server-aware report gate checks', () => {
    const denied = evaluateReportsGate({
      role: 'client',
      plan: 'standard',
      trialState: 'active',
      dependencyState: { reportingEnabled: true },
      verificationState: 'verified',
    });

    expect(denied.canViewReports).toBe(false);
    expect(denied.reason).toBe('role_not_allowed');
  });
});
