import type { AppointmentAggregate, ClientCode } from "@acuity/contracts";

type ClientUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

const users = new Map<string, ClientUser>();
const emailsToIds = new Map<string, string>();
const appointmentsByClient = new Map<string, AppointmentAggregate[]>();
const codesByClient = new Map<string, ClientCode[]>();

function seedUser(): ClientUser {
  const id = "3eb2f16a-f674-4f3f-ba3c-6e5f5e6d57db";
  const user: ClientUser = {
    id,
    name: "Demo Client",
    email: "client@example.com",
    passwordHash: "password123"
  };

  users.set(id, user);
  emailsToIds.set(user.email, id);
  appointmentsByClient.set(id, [
    {
      id: "9d2faebf-6f5d-4d17-a584-21d8f2c0f1ed",
      clientId: id,
      appointmentTypeName: "Consultation",
      startsAt: new Date(Date.now() + 86400000).toISOString(),
      endsAt: new Date(Date.now() + 90000000).toISOString(),
      timezone: "America/New_York",
      status: "scheduled",
      locationLabel: "Zoom",
      canCancel: true,
      canReschedule: true
    }
  ]);
  codesByClient.set(id, [
    {
      id: "e4ef2cbe-5c57-45b8-b997-cd5078cbedec",
      code: "WELCOME10",
      type: "coupon",
      status: "active",
      expiresAt: null
    }
  ]);

  return user;
}

seedUser();

export function createClientUser(payload: { name: string; email: string; password: string }) {
  if (emailsToIds.has(payload.email)) return null;
  const id = crypto.randomUUID();
  const user: ClientUser = {
    id,
    name: payload.name,
    email: payload.email,
    passwordHash: payload.password
  };
  users.set(id, user);
  emailsToIds.set(payload.email, id);
  appointmentsByClient.set(id, []);
  codesByClient.set(id, []);
  return user;
}

export function authenticateClient(email: string, password: string): ClientUser | null {
  const id = emailsToIds.get(email);
  if (!id) return null;
  const user = users.get(id);
  if (!user || user.passwordHash !== password) return null;
  return user;
}

export function getClientById(id: string) {
  return users.get(id) ?? null;
}

export function getAppointmentsForClient(clientId: string) {
  return appointmentsByClient.get(clientId) ?? [];
}

export function getCodesForClient(clientId: string) {
  return codesByClient.get(clientId) ?? [];
}
