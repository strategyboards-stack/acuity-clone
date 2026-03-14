export type HostBillingOverviewContract = {
  plan: 'trial' | 'standard' | 'premium';
  trialEndsOn: string | null;
  paymentInfoPresent: boolean;
  billingAddressComplete: boolean;
  hasSubscriptions: boolean;
  hasInvoices: boolean;
};
