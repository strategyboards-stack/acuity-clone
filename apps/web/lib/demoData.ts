export type PreviewStatus = 'clickable' | 'backend_only' | 'not_implemented';

export type PreviewSurface = {
  slug: string;
  name: string;
  status: PreviewStatus;
  notes: string;
};

export const demoIdentities = [
  { id: 'demo-owner', role: 'Owner Admin', email: 'owner.demo@acuity.local' },
  { id: 'demo-client', role: 'Client', email: 'client.demo@acuity.local' },
  { id: 'demo-contributor', role: 'Contributor', email: 'contrib.demo@acuity.local' }
] as const;

export const previewSurfaces: PreviewSurface[] = [
  { slug: 'public-scheduler', name: 'Public Scheduler / Booking', status: 'clickable', notes: 'Static preview route for booking entry and service selection shell.' },
  { slug: 'client-self-service', name: 'Client Auth + Self-Service', status: 'clickable', notes: 'Preview shell for account menu and self-service actions.' },
  { slug: 'admin-calendar', name: 'Admin Calendar', status: 'clickable', notes: 'Preview shell for calendar operations and appointment detail panel.' },
  { slug: 'clients-crm', name: 'Clients CRM', status: 'clickable', notes: 'Preview shell for client list, filters, and notes surfaces.' },
  { slug: 'money-surfaces', name: 'Money Surfaces', status: 'clickable', notes: 'Preview shell for payments, invoices, and stored value products.' },
  { slug: 'communications', name: 'Communications', status: 'clickable', notes: 'Preview shell for client emails, SMS reminders, and admin alerts.' },
  { slug: 'integrations-sync', name: 'Integrations + Calendar Sync', status: 'clickable', notes: 'Preview shell showing adapter boundaries and sync settings shell.' },
  { slug: 'reports', name: 'Reports', status: 'clickable', notes: 'Preview shell for appointments, revenue, and user reports entry points.' },
  { slug: 'manage-users', name: 'Manage Users / Permissions Shell', status: 'clickable', notes: 'Host-shell style permissions area with local-only role switch guidance.' },
  { slug: 'manage-billing', name: 'Account Billing Shell', status: 'clickable', notes: 'Host-shell billing entry with trial/plan placeholders for local review.' },
  { slug: 'domain-events', name: 'Backend Domain Events', status: 'backend_only', notes: 'Appointment-centric domain/event flows not visually represented in current build.' },
  { slug: 'worker-jobs', name: 'Async Worker Jobs', status: 'backend_only', notes: 'Queue-driven reminders and sync jobs are documented but not executable UI.' },
  { slug: 'native-app', name: 'Native App', status: 'not_implemented', notes: 'Out of evidence and out of scope for this repository stage.' }
];

export const statusLabel: Record<PreviewStatus, string> = {
  clickable: 'Implemented and clickable now',
  backend_only: 'Implemented as backend/domain-only',
  not_implemented: 'Not implemented yet'
};
