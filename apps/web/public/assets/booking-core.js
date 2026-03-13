const APPOINTMENTS_KEY = "acuity.phase3b.appointments";

const appointmentTypes = {
  "initial-consultation": { slug: "initial-consultation", name: "Initial Consultation", visibility: "public" },
  "vip-follow-up": { slug: "vip-follow-up", name: "VIP Follow-up", visibility: "private", directLinkOnly: true }
};

export function getAppointmentType(slug) {
  return appointmentTypes[slug];
}

export function canAccessAppointmentType(slug, directLink) {
  const type = getAppointmentType(slug);
  if (!type) return false;
  if (type.visibility === "public") return true;
  return Boolean(type.directLinkOnly && directLink);
}

export function validateBooking(input) {
  const errors = [];
  if (!input.firstName?.trim()) errors.push("First name is required");
  if (!input.lastName?.trim()) errors.push("Last name is required");
  if (!input.email?.includes("@")) errors.push("Valid email is required");
  if (!input.phone?.trim() || input.phone.trim().length < 7) errors.push("Phone is required");
  if (!input.date) errors.push("Date is required");
  if (!input.time) errors.push("Time is required");
  if (!canAccessAppointmentType(input.appointmentTypeSlug, input.directLink)) errors.push("Appointment type unavailable");
  return errors;
}

export function readAppointments(storage = localStorage) {
  const raw = storage.getItem(APPOINTMENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function writeAppointments(list, storage = localStorage) {
  storage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
}

export function createAppointment(input, storage = localStorage) {
  const errors = validateBooking(input);
  if (errors.length) {
    throw new Error(errors[0]);
  }

  const list = readAppointments(storage);
  const id = `apt_${Math.random().toString(36).slice(2, 10)}`;
  const appointment = {
    id,
    appointmentTypeSlug: input.appointmentTypeSlug,
    date: input.date,
    time: input.time,
    client: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim()
    },
    notes: input.notes || "",
    recurring: {
      enabled: input.recurringFrequency !== "none",
      frequency: input.recurringFrequency || "none"
    },
    createdAt: new Date().toISOString()
  };
  list.push(appointment);
  writeAppointments(list, storage);
  return appointment;
}

export function getAppointmentById(id, storage = localStorage) {
  return readAppointments(storage).find((appointment) => appointment.id === id);
}
