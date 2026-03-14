const premiumOnlyCaps = [
    'api-credentials',
    'custom-sidebar',
    'conversion-tracking'
];
const dependencySensitiveCaps = [
    'calendar-sync-two-way',
    'webhooks',
    'analytics-config'
];
export function evaluateIntegrationCapability(capability, context) {
    if (context.role === 'viewer') {
        return { capability, allowed: false, reason: 'insufficient-role' };
    }
    if (premiumOnlyCaps.includes(capability) && context.plan === 'starter') {
        return { capability, allowed: false, reason: 'plan-lock' };
    }
    if (capability === 'calendar-sync-two-way' && context.trialActive) {
        return { capability, allowed: false, reason: 'trial-lock' };
    }
    if (dependencySensitiveCaps.includes(capability) && !context.dependencyReady) {
        return { capability, allowed: false, reason: 'dependency-lock' };
    }
    if (capability === 'webhooks' && !context.verificationReady) {
        return { capability, allowed: false, reason: 'verification-lock' };
    }
    return { capability, allowed: true, reason: 'ok' };
}
