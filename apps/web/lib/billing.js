export const defaultHostBillingState = {
  role: 'owner',
  plan: 'trial',
  trialEndsOn: '2026-04-01',
  verificationComplete: true,
  dependencyState: 'processor_unlinked',
  billingAddressComplete: false,
  paymentInfoPresent: false,
  hasInvoices: false,
  hasSubscriptions: false,
};

export function evaluateBillingGates(state) {
  const canAccessShell = state.role === 'owner' || state.role === 'admin';
  const requiresUpgrade = state.plan === 'trial';

  return {
    canAccessShell,
    requiresUpgrade,
    incompleteAddress: !state.billingAddressComplete,
    canEditPaymentInformation:
      canAccessShell &&
      state.verificationComplete &&
      state.dependencyState === 'ready' &&
      !requiresUpgrade &&
      state.billingAddressComplete,
  };
}

export function stateFromSearchParams(searchParams) {
  const state = { ...defaultHostBillingState };
  const read = (key) => searchParams.get(key);

  const plan = read('plan');
  if (plan === 'trial' || plan === 'standard' || plan === 'premium') state.plan = plan;

  const role = read('role');
  if (role === 'owner' || role === 'admin' || role === 'contributor') state.role = role;

  if (read('dependency') === 'ready') state.dependencyState = 'ready';
  if (read('address') === 'complete') state.billingAddressComplete = true;
  if (read('payment') === 'present') state.paymentInfoPresent = true;
  if (read('invoices') === 'some') state.hasInvoices = true;
  if (read('subscriptions') === 'some') state.hasSubscriptions = true;
  if (read('verification') === 'pending') state.verificationComplete = false;

  return state;
}
