import React from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export const previewScreenBySlug: Record<string, React.ReactNode> = {
  'public-scheduler': (
    <>
      <Section title="Service selection">
        <ul>
          <li>60m Coaching Session — $120</li>
          <li>30m Intro Call — Free</li>
          <li>90m Strategy Intensive — $240</li>
        </ul>
      </Section>
      <Section title="Time slots">
        <p>Tue Mar 18: 09:00 AM, 10:30 AM, 02:00 PM</p>
      </Section>
      <Section title="Booking form snapshot">
        <p>Fields: name, email, phone, notes, consent checkbox.</p>
      </Section>
    </>
  ),
  'client-self-service': (
    <>
      <Section title="Upcoming appointments">
        <ul>
          <li>Mar 18, 10:30 AM — 60m Coaching Session</li>
          <li>Apr 02, 02:00 PM — Strategy Intensive</li>
        </ul>
      </Section>
      <Section title="Self-service actions">
        <p>Reschedule, Cancel, Edit Info, and Manage Codes entry points are visible.</p>
      </Section>
    </>
  ),
  'admin-calendar': (
    <>
      <Section title="Calendar day view">
        <p>Today: 3 appointments, 1 blocked-off time segment.</p>
      </Section>
      <Section title="Appointment detail pane">
        <p>Client, service, notes, payment status, and follow-up action controls.</p>
      </Section>
    </>
  ),
  'clients-crm': (
    <>
      <Section title="Client list">
        <ul>
          <li>Ada Lovelace — last visit 14 days ago</li>
          <li>Grace Hopper — VIP tag</li>
          <li>Katherine Johnson — banned: no</li>
        </ul>
      </Section>
      <Section title="CRM actions">
        <p>Add client, edit client, internal notes, and appointment context links.</p>
      </Section>
    </>
  ),
  'money-surfaces': (
    <>
      <Section title="Payments & invoicing">
        <p>Processor status: disconnected (demo). Invoice list and payment-at-booking settings shown.</p>
      </Section>
      <Section title="Stored value products">
        <p>Packages, gift certificates, and subscriptions listing surface shown with plan-gate notes.</p>
      </Section>
    </>
  ),
  communications: (
    <>
      <Section title="Client email templates">
        <p>Confirmation, reminder, follow-up, and receipt templates listed.</p>
      </Section>
      <Section title="SMS and admin alerts">
        <p>SMS reminder editor and admin alert toggles visible with gate/dependency badges.</p>
      </Section>
    </>
  ),
  'integrations-sync': (
    <>
      <Section title="Integration adapters">
        <p>QuickBooks, Zoom, Analytics, Zapier/Zoho, Webhooks, API credential entry points.</p>
      </Section>
      <Section title="Calendar sync">
        <p>Two-way connected calendar sync and separate one-way ICS publication sections are split.</p>
      </Section>
    </>
  ),
  reports: (
    <>
      <Section title="Report index">
        <p>Appointments, Revenue, Users, Intake Form answers, Tips, and Export entry points.</p>
      </Section>
      <Section title="Filters">
        <p>Date range, appointment type, calendar owner, and export controls.</p>
      </Section>
    </>
  ),
  'manage-users': (
    <>
      <Section title="Permissions shell">
        <p>Owner controls and contributor invitation shell remain separate from scheduling tabs.</p>
      </Section>
      <Section title="Role matrix snapshot">
        <p>Owner admin, contributor, and client access level summaries.</p>
      </Section>
    </>
  ),
  'manage-billing': (
    <>
      <Section title="Billing shell">
        <p>Payment method summary, site invoices, plan and trial status blocks.</p>
      </Section>
      <Section title="Subscription controls">
        <p>Upgrade/downgrade shell entries and invoice history links.</p>
      </Section>
    </>
  )
};
