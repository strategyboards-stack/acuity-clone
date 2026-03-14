export const seedClients = [
  { id: "cl-001", firstName: "Maya", lastName: "Nguyen", email: "maya@example.com", phone: "+1 555-0101", notes: "Prefers late afternoon sessions.", status: "active", upcomingAppointments: 2, lastAppointmentAt: "2026-03-10T10:30:00Z" },
  { id: "cl-002", firstName: "Andre", lastName: "Santos", email: "andre@example.com", phone: "", notes: "Requested invoice copy via email.", status: "active", upcomingAppointments: 0, lastAppointmentAt: "2026-02-20T18:00:00Z" },
  { id: "cl-003", firstName: "Erin", lastName: "Wong", email: "", phone: "+1 555-0188", notes: "", status: "inactive", upcomingAppointments: 0, lastAppointmentAt: null }
];

export function fullName(client) {
  return `${client.firstName} ${client.lastName}`;
}

export function validateClientInput(payload) {
  if (!payload.firstName?.trim()) return "First name is required.";
  if (!payload.lastName?.trim()) return "Last name is required.";
  if (!payload.email?.trim() && !payload.phone?.trim()) return "At least one contact path (email or phone) is required.";
  return null;
}

export function searchAndFilterClients(clients, searchTerm, filter) {
  const normalized = searchTerm.trim().toLowerCase();
  return clients.filter((client) => {
    const matchesSearch = !normalized || fullName(client).toLowerCase().includes(normalized) || client.email.toLowerCase().includes(normalized) || client.phone.toLowerCase().includes(normalized);
    const matchesFilter =
      filter === "all" ||
      (filter === "withUpcoming" && client.upcomingAppointments > 0) ||
      (filter === "withoutUpcoming" && client.upcomingAppointments === 0) ||
      (filter === "inactive" && client.status === "inactive");
    return matchesSearch && matchesFilter;
  });
}

export function generateClientId(clients) {
  return `cl-${String(clients.length + 1).padStart(3, "0")}`;
}
