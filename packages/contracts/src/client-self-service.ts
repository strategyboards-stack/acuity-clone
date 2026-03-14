export type AppointmentLifecycleAction = 'edit-info' | 'reschedule' | 'cancel';

export type AppointmentStatus = 'booked' | 'completed' | 'canceled';

export interface ClientSession {
  sessionToken: string;
  clientId: string;
  clientEmail: string;
  clientName: string;
}

export interface AppointmentIdentity {
  appointmentId: string;
  publicCode: string;
}

export interface ClientAppointment extends AppointmentIdentity {
  serviceName: string;
  startsAtIso: string;
  timezone: string;
  status: AppointmentStatus;
}

export interface ManageCode {
  code: string;
  type: 'package' | 'gift-certificate' | 'subscription';
  status: 'active' | 'redeemed' | 'expired';
  remainingUses?: number;
}

export interface SelfServiceModel {
  session: ClientSession;
  appointments: ClientAppointment[];
  manageCodes: ManageCode[];
}

export interface AppointmentActionEntry {
  identity: AppointmentIdentity;
  action: AppointmentLifecycleAction;
}
