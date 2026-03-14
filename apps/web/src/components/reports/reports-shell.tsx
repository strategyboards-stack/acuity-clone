import type { ReportFilterSelection, ReportQuestionSelection, ReportTab } from '@acuity/contracts';
import { buildReportDataset } from '@/lib/reporting/dataset';

interface ReportsShellProps {
  tab: ReportTab;
  filters: ReportFilterSelection;
  questionSelection?: ReportQuestionSelection;
}

export function ReportsShell({ tab, filters, questionSelection }: ReportsShellProps) {
  const dataset = buildReportDataset(tab, filters, questionSelection);

  return (
    <section style={{ border: '1px solid #d8d8d8', borderRadius: 8, padding: 16 }}>
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ margin: '0 0 8px' }}>{toTabLabel(tab)}</h2>
        <p style={{ margin: 0, color: '#525252' }}>
          Date range: {filters.dateRange.startDate} → {filters.dateRange.endDate}; Calendars:{' '}
          {filters.calendarIds.length === 0 ? 'All' : filters.calendarIds.join(', ')}
        </p>
      </header>

      {dataset.requiresQuestionSelection ? (
        <div style={{ padding: 12, background: '#f5f7ff', borderRadius: 8 }}>
          Select an intake-form question and click Show to load this report.
        </div>
      ) : dataset.isEmpty ? (
        <div style={{ padding: 12, background: '#fafafa', borderRadius: 8 }}>
          No report data for the selected filters.
        </div>
      ) : (
        <>
          <ul>
            {dataset.summary.map((metric) => (
              <li key={metric.id}>
                <strong>{metric.label}:</strong> {metric.value}
              </li>
            ))}
          </ul>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Label</th>
                <th align="left">Value</th>
                <th align="left">Calendar</th>
                <th align="left">Date</th>
              </tr>
            </thead>
            <tbody>
              {dataset.rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                  <td>{row.calendarId}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

function toTabLabel(tab: ReportTab): string {
  switch (tab) {
    case 'appointments':
      return 'Appointments report';
    case 'revenue':
      return 'Revenue report';
    case 'users':
      return 'Users report';
    case 'intakeForms':
      return 'Intake Forms report';
    case 'tips':
      return 'Tips report';
  }
}
