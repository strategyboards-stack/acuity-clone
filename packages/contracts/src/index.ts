export type ServiceVisibility = "PUBLIC" | "PRIVATE_DIRECT_LINK";

export interface PublicSchedulerService {
  id: string;
  slug: string;
  name: string;
  durationMinutes: number;
  visibility: ServiceVisibility;
  adminOnly: boolean;
  internalUseForm: boolean;
  supportsMultiTime: boolean;
  supportsRecurring: boolean;
}

export interface PublicSlot {
  startIso: string;
  endIso: string;
  available: boolean;
}
