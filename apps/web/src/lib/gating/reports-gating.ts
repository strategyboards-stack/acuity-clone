import type { ReportAccessContext, ReportsGateResult } from '@acuity/contracts';

export function evaluateReportsGate(context: ReportAccessContext): ReportsGateResult {
  const roleAllowed = context.role === 'owner' || context.role === 'admin' || context.role === 'contributor';
  if (!roleAllowed) {
    return { canViewReports: false, reason: 'role_not_allowed' };
  }

  if (!context.dependencyState.reportingEnabled) {
    return { canViewReports: false, reason: 'dependency_not_ready' };
  }

  if (context.trialState === 'expired') {
    return { canViewReports: false, reason: 'trial_expired' };
  }

  if (context.verificationState !== 'verified') {
    return { canViewReports: false, reason: 'verification_required' };
  }

  return { canViewReports: true };
}
