export function evaluateCommunicationGate(channel, context) {
  if (!['OWNER', 'ADMIN', 'CONTRIBUTOR'].includes(context.role)) {
    return { allowed: false, reason: 'ROLE_FORBIDDEN' };
  }

  if (channel === 'SMS_REMINDER') {
    const smsPlanAllowed = ['STANDARD', 'PREMIUM', 'ENTERPRISE'].includes(context.plan);
    if (!smsPlanAllowed) {
      return { allowed: false, reason: 'PLAN_LOCKED' };
    }
    if (!context.dependencyState.smsEnabled) {
      return { allowed: false, reason: 'DEPENDENCY_MISSING' };
    }
  }

  if (channel !== 'SMS_REMINDER' && !context.dependencyState.emailEnabled) {
    return { allowed: false, reason: 'DEPENDENCY_MISSING' };
  }

  return { allowed: true };
}
