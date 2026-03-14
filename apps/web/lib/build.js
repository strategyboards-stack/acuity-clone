import { mkdirSync, writeFileSync } from 'node:fs';
import { defaultHostBillingState } from './billing.js';
import { renderBillingShell, renderSchedulingMoneyBoundary } from './render.js';

const css = `body{font-family:Arial,sans-serif;background:#f7f8fb;margin:0}.container{max-width:1000px;margin:0 auto;padding:24px}.shell{display:grid;grid-template-columns:240px 1fr;gap:16px}.nav a{display:block;padding:8px;border-radius:6px;text-decoration:none}.active{background:#e8edff}.card{background:white;padding:14px;border:1px solid #dde2ef;border-radius:10px}.notice{background:#fff8e6;padding:8px;border-left:4px solid #c57a00}.empty{padding:16px;border:1px dashed #bcc7e2;border-radius:8px;text-align:center}.muted{color:#667085}`;
const withDoc = (body) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body>${body}
<script>let dirty=false;const form=document.getElementById('billing-form');if(form){form.addEventListener('input',()=>dirty=true);window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}})}</script>
</body></html>`;

mkdirSync('public', { recursive: true });
writeFileSync('public/account-billing-overview.html', withDoc(renderBillingShell('/account/billing', defaultHostBillingState)));
writeFileSync('public/account-billing-payment-information.html', withDoc(renderBillingShell('/account/billing/payment-information', defaultHostBillingState)));
writeFileSync('public/account-billing-subscriptions.html', withDoc(renderBillingShell('/account/billing/subscriptions', defaultHostBillingState)));
writeFileSync('public/account-billing-invoices.html', withDoc(renderBillingShell('/account/billing/invoices', defaultHostBillingState)));
writeFileSync('public/scheduling-money-boundary.html', withDoc(renderSchedulingMoneyBoundary()));
console.log('Built billing shell foundation static artifacts in apps/web/public');
