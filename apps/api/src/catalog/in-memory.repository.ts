import type {
  AddOn,
  AppointmentCoupon,
  AppointmentType,
  CreateAddOn,
  CreateAppointmentCoupon,
  CreateAppointmentType,
  CreateIntakeForm,
  IntakeForm,
  IntakeQuestion
} from './types.js';
import type { CatalogRepository } from './types.js';

export class InMemoryCatalogRepository implements CatalogRepository {
  private readonly appointmentTypes: AppointmentType[] = [];
  private readonly addOns: AddOn[] = [];
  private readonly coupons: AppointmentCoupon[] = [];
  private readonly intakeForms: Array<IntakeForm & { questions: IntakeQuestion[] }> = [];

  async createAppointmentType(input: CreateAppointmentType): Promise<AppointmentType> {
    const created: AppointmentType = {
      id: createId(),
      active: input.active ?? true,
      directBookingLink: input.privateType ? (input.directBookingLink ?? `https://scheduler.example.com/${createId()}`) : null,
      ...input
    };
    this.appointmentTypes.push(created);
    return created;
  }
  async createAddOn(input: CreateAddOn): Promise<AddOn> {
    const created: AddOn = { id: createId(), active: input.active ?? true, ...input };
    this.addOns.push(created);
    return created;
  }
  async createAppointmentCoupon(input: CreateAppointmentCoupon): Promise<AppointmentCoupon> {
    const created: AppointmentCoupon = { id: createId(), active: input.active ?? true, expiresAt: input.expiresAt ?? null, ...input };
    this.coupons.push(created);
    return created;
  }
  async createIntakeForm(input: CreateIntakeForm): Promise<IntakeForm & { questions: IntakeQuestion[] }> {
    const formId = createId();
    const created = {
      id: formId,
      active: input.active ?? true,
      accountId: input.accountId,
      name: input.name,
      internalUse: input.internalUse,
      questions: input.questions.map((q) => ({ id: createId(), formId, ...q }))
    };
    this.intakeForms.push(created);
    return created;
  }
  async listPublicAppointmentTypes(accountId: string) { return this.appointmentTypes.filter((i) => i.accountId === accountId && i.active && !i.privateType); }
  async listPublicAddOns(accountId: string) { return this.addOns.filter((i) => i.accountId === accountId && i.active && !i.adminOnly); }
  async listPublicIntakeForms(accountId: string) { return this.intakeForms.filter((i) => i.accountId === accountId && i.active && !i.internalUse); }
}

function createId(): string { return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`; }
