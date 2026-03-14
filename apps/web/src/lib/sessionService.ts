import type { AppointmentActionEntry, SelfServiceModel } from '@acuity/contracts';
import { seededSelfServiceData } from '../data/selfServiceData';

const sessionState = {
  activeToken: 'token-valid'
};

export function getActiveToken(): string | null {
  return sessionState.activeToken;
}

export function setActiveToken(token: string | null): void {
  sessionState.activeToken = token;
}

export async function loadClientSelfService(token: string | null): Promise<SelfServiceModel | null> {
  if (!token) {
    return null;
  }

  const model = seededSelfServiceData[token];
  return model ?? null;
}

export function buildActionEntry(identity: { appointmentId: string; publicCode: string }, action: AppointmentActionEntry['action']): AppointmentActionEntry {
  return {
    identity,
    action
  };
}
