import { evaluateBillingGates } from './billing.js';

function empty(text) {
  return `<div class="empty">${text}</div>`;
}

export function renderBillingShell(pathname, state) {
  const gate = evaluateBillingGates(state);
  if (!gate.canAccessShell) {
    return `<main class="container"><h1>Manage Billing</h1>${empty('Manage Billing is restricted to owner/admin roles.')}</main>`;
  }

  const navItems = [
    ['/account/billing', 'Overview'],
    ['/account/billing/payment-information', 'Payment Information'],
    ['/account/billing/subscriptions', 'Subscriptions'],
    ['/account/billing/invoices', 'Site Invoices'],
  ]
    .map(([href, label]) => `<a class="${pathname === href ? 'active' : ''}" href="${href}">${label}</a>`)
    .join('');

  let content = '<h2>Billing overview</h2>';

  if (pathname.endsWith('/payment-information')) {
    content = `<h2>Payment Information</h2>
${gate.incompleteAddress ? '<p class="notice warn">Billing address incomplete; payment edits are blocked.</p>' : ''}
${state.paymentInfoPresent ? '<p>Payment profile exists.</p>' : empty('No payment method on file.')}
<form id="billing-form"><label>Cardholder Name <input name="cardholderName" /></label><button id="save" type="submit" ${gate.canEditPaymentInformation ? '' : 'disabled'}>Save draft</button></form>`;
  }

  if (pathname.endsWith('/subscriptions')) {
    content = `<h2>Site subscriptions</h2>${state.hasSubscriptions ? '<p>Subscription records placeholder.</p>' : empty('No subscriptions for this account state.')}`;
  }

  if (pathname.endsWith('/invoices')) {
    content = `<h2>Site/account invoices</h2>${state.hasInvoices ? '<p>Invoice records placeholder.</p>' : empty('No site invoices yet.')}`;
  }

  return `<main class="container"><h1>Manage Billing</h1>
<p class="muted">Host/account shell. Scheduling-money remains separate.</p>
${gate.requiresUpgrade ? '<p class="notice warn">Trial state active. Upgrade required for live payment editing.</p>' : ''}
<div class="shell"><aside class="nav">${navItems}<a href="/admin/scheduling-money">Scheduling money surface</a></aside><section class="card">${content}</section></div></main>`;
}

export function renderSchedulingMoneyBoundary() {
  return '<main class="container"><h1>Scheduling money surface</h1><p>Separated from host/account billing shell by route and domain boundary.</p></main>';
}
