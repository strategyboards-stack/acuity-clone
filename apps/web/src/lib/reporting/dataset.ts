import type {
  ReportDataset,
  ReportFilterSelection,
  ReportQuestionSelection,
  ReportRow,
  ReportSummaryMetric,
  ReportTab,
} from '@acuity/contracts';

const baseRows: Record<Exclude<ReportTab, 'intakeForms'>, ReportRow[]> = {
  appointments: [
    { id: 'a-1', label: 'Confirmed', value: 22, calendarId: 'cal-1', date: '2026-03-01' },
    { id: 'a-2', label: 'Canceled', value: 3, calendarId: 'cal-2', date: '2026-03-04' },
  ],
  revenue: [
    { id: 'r-1', label: 'Collected', value: 1820, calendarId: 'cal-1', date: '2026-03-02' },
  ],
  users: [
    { id: 'u-1', label: 'Pat Morgan', value: 12, calendarId: 'cal-1', date: '2026-03-02' },
    { id: 'u-2', label: 'Alex Chen', value: 9, calendarId: 'cal-2', date: '2026-03-03' },
  ],
  tips: [],
};

function applyFilters(rows: ReportRow[], filters: ReportFilterSelection): ReportRow[] {
  const calendarsFiltered =
    filters.calendarIds.length === 0
      ? rows
      : rows.filter((row) => filters.calendarIds.includes(row.calendarId));

  return calendarsFiltered.filter(
    (row) => row.date >= filters.dateRange.startDate && row.date <= filters.dateRange.endDate,
  );
}

function buildSummary(rows: ReportRow[]): ReportSummaryMetric[] {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return [
    { id: 'totalRows', label: 'Rows', value: rows.length },
    { id: 'totalValue', label: 'Total', value: total },
  ];
}

export function buildReportDataset(
  tab: ReportTab,
  filters: ReportFilterSelection,
  questionSelection?: ReportQuestionSelection,
): ReportDataset {
  if (tab === 'intakeForms') {
    const ready = Boolean(questionSelection?.submitted && questionSelection.selectedQuestionId);
    if (!ready) {
      return {
        tab,
        rows: [],
        summary: [],
        isEmpty: true,
        requiresQuestionSelection: true,
      };
    }

    const rows = applyFilters(
      [
        { id: 'i-1', label: 'How did you hear about us?', value: 7, calendarId: 'cal-1', date: '2026-03-02' },
        { id: 'i-2', label: 'Friend referral', value: 3, calendarId: 'cal-2', date: '2026-03-05' },
      ],
      filters,
    );

    return {
      tab,
      rows,
      summary: buildSummary(rows),
      isEmpty: rows.length === 0,
      requiresQuestionSelection: false,
    };
  }

  const rows = applyFilters(baseRows[tab], filters);
  return {
    tab,
    rows,
    summary: buildSummary(rows),
    isEmpty: rows.length === 0,
  };
}
