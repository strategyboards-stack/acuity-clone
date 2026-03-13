import type { PublicSchedulerService, PublicSlot } from "@acuity/contracts";

export const serviceCatalog: PublicSchedulerService[] = [
  {
    id: "svc-consult-60",
    slug: "initial-consult",
    name: "Initial Consultation",
    durationMinutes: 60,
    visibility: "PUBLIC",
    adminOnly: false,
    internalUseForm: false,
    supportsMultiTime: true,
    supportsRecurring: true,
  },
  {
    id: "svc-followup-30",
    slug: "follow-up",
    name: "Follow-up Session",
    durationMinutes: 30,
    visibility: "PUBLIC",
    adminOnly: false,
    internalUseForm: false,
    supportsMultiTime: false,
    supportsRecurring: true,
  },
  {
    id: "svc-vip",
    slug: "vip-private",
    name: "VIP Private Session",
    durationMinutes: 90,
    visibility: "PRIVATE_DIRECT_LINK",
    adminOnly: false,
    internalUseForm: false,
    supportsMultiTime: true,
    supportsRecurring: true,
  },
  {
    id: "svc-admin-only-addon",
    slug: "admin-addon",
    name: "Admin-only Intake Add-on",
    durationMinutes: 20,
    visibility: "PUBLIC",
    adminOnly: true,
    internalUseForm: false,
    supportsMultiTime: false,
    supportsRecurring: false,
  },
  {
    id: "svc-internal-form",
    slug: "internal-only",
    name: "Internal Use Diagnostic",
    durationMinutes: 45,
    visibility: "PUBLIC",
    adminOnly: false,
    internalUseForm: true,
    supportsMultiTime: false,
    supportsRecurring: false,
  },
];

export interface SchedulerQuery {
  service?: string;
  date?: string;
  mode?: "single" | "multi";
}

export function getPublicCatalog(): PublicSchedulerService[] {
  return serviceCatalog.filter(
    (service) => service.visibility === "PUBLIC" && !service.adminOnly && !service.internalUseForm,
  );
}

export function resolveService(query: SchedulerQuery): PublicSchedulerService | null {
  if (!query.service) {
    return null;
  }

  const matched = serviceCatalog.find((service) => service.slug === query.service);
  if (!matched) {
    return null;
  }

  if (matched.adminOnly || matched.internalUseForm) {
    return null;
  }

  return matched;
}

export function generateSlots(date: string, durationMinutes: number): PublicSlot[] {
  const base = new Date(`${date}T09:00:00.000Z`);
  if (Number.isNaN(base.getTime())) {
    return [];
  }

  return Array.from({ length: 8 }).map((_, idx) => {
    const start = new Date(base.getTime() + idx * 60 * 60 * 1000);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return {
      startIso: start.toISOString(),
      endIso: end.toISOString(),
      available: idx % 3 !== 2,
    };
  });
}
