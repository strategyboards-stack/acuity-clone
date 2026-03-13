export type PlanTier = 'FREE' | 'STANDARD' | 'PREMIUM';
export type UserRole = 'OWNER' | 'ADMIN' | 'CONTRIBUTOR';

export interface FeatureContext {
  role: UserRole;
  plan: PlanTier;
  inTrial: boolean;
  dependencyReady: boolean;
  verificationReady: boolean;
}

export interface AppointmentType {
  id: string;
  accountId: string;
  name: string;
  durationMinutes: number;
  privateType: boolean;
  directBookingLink: string | null;
  active: boolean;
}

export interface CreateAppointmentType extends Omit<AppointmentType, 'id' | 'directBookingLink' | 'active'> {
  directBookingLink?: string;
  active?: boolean;
}

export interface AddOn {
  id: string;
  accountId: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
  adminOnly: boolean;
  active: boolean;
}

export interface CreateAddOn extends Omit<AddOn, 'id' | 'active'> { active?: boolean; }

export interface AppointmentCoupon {
  id: string;
  accountId: string;
  code: string;
  discountPercent: number;
  expiresAt: string | null;
  active: boolean;
}

export interface CreateAppointmentCoupon extends Omit<AppointmentCoupon, 'id' | 'expiresAt' | 'active'> { expiresAt?: string; active?: boolean; }

export interface IntakeForm {
  id: string;
  accountId: string;
  name: string;
  internalUse: boolean;
  active: boolean;
}

export interface IntakeQuestion {
  id: string;
  formId: string;
  prompt: string;
  required: boolean;
  position: number;
}

export interface CreateIntakeForm extends Omit<IntakeForm, 'id' | 'active'> { active?: boolean; questions: Array<Omit<IntakeQuestion, 'id' | 'formId'>>; }

export interface CatalogRepository {
  createAppointmentType(input: CreateAppointmentType): Promise<AppointmentType>;
  createAddOn(input: CreateAddOn): Promise<AddOn>;
  createAppointmentCoupon(input: CreateAppointmentCoupon): Promise<AppointmentCoupon>;
  createIntakeForm(input: CreateIntakeForm): Promise<IntakeForm & { questions: IntakeQuestion[] }>;
  listPublicAppointmentTypes(accountId: string): Promise<AppointmentType[]>;
  listPublicAddOns(accountId: string): Promise<AddOn[]>;
  listPublicIntakeForms(accountId: string): Promise<(IntakeForm & { questions: IntakeQuestion[] })[]>;
}
