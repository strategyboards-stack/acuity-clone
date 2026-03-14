export type ReportTab =
  | 'appointments'
  | 'revenue'
  | 'users'
  | 'intakeForms'
  | 'tips';

export type DateRangePreset =
  | 'last7Days'
  | 'last30Days'
  | 'thisMonth'
  | 'custom';

export interface ReportDateRange {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
}

export interface ReportFilterSelection {
  calendarIds: string[];
  dateRange: ReportDateRange;
}

export interface ReportRow {
  id: string;
  label: string;
  value: number;
  calendarId: string;
  date: string;
}

export interface ReportSummaryMetric {
  id: string;
  label: string;
  value: number;
}

export interface ReportDataset {
  tab: ReportTab;
  rows: ReportRow[];
  summary: ReportSummaryMetric[];
  isEmpty: boolean;
  requiresQuestionSelection?: boolean;
}

export interface ReportQuestionSelection {
  selectedQuestionId?: string;
  submitted: boolean;
}

export interface ReportAccessContext {
  role: 'owner' | 'admin' | 'contributor' | 'client';
  plan: 'free' | 'starter' | 'standard' | 'premium';
  trialState: 'trialing' | 'active' | 'expired';
  dependencyState: {
    reportingEnabled: boolean;
  };
  verificationState: 'verified' | 'unverified';
}

export interface ReportsGateResult {
  canViewReports: boolean;
  reason?: string;
}
