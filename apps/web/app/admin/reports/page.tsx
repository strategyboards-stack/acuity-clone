import type { ReportFilterSelection, ReportTab } from '@acuity/contracts';
import { ReportsShell } from '@/components/reports/reports-shell';
import { evaluateReportsGate } from '@/lib/gating/reports-gating';

const tabs: ReportTab[] = ['appointments', 'revenue', 'users', 'intakeForms', 'tips'];
const defaultFilters: ReportFilterSelection = {
  calendarIds: ['cal-1'],
  dateRange: {
    preset: 'last30Days',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  },
};

export default function ReportsPage() {
  const gate = evaluateReportsGate({
    role: 'admin',
    plan: 'standard',
    trialState: 'active',
    dependencyState: { reportingEnabled: true },
    verificationState: 'verified',
  });

  if (!gate.canViewReports) {
    return <main style={{ padding: 24 }}>Reports unavailable: {gate.reason}</main>;
  }

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <h1 style={{ margin: 0 }}>Reports</h1>
      {tabs.map((tab) => (
        <ReportsShell
          key={tab}
          tab={tab}
          filters={defaultFilters}
          questionSelection={tab === 'intakeForms' ? { submitted: false } : undefined}
        />
      ))}
    </main>
  );
}
