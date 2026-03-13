import type {
  CreateAddOn,
  CreateAppointmentCoupon,
  CreateAppointmentType,
  CreateIntakeForm,
  FeatureContext,
  CatalogRepository
} from './types.js';
import { FeatureGateService } from './feature-gate.service.js';

export class CatalogService {
  constructor(
    private readonly repository: CatalogRepository,
    private readonly featureGateService = new FeatureGateService()
  ) {}

  async createAppointmentType(context: FeatureContext, input: CreateAppointmentType) {
    this.featureGateService.assertCatalogConfigurationAccess(context);
    return this.repository.createAppointmentType(input);
  }
  async createAddOn(context: FeatureContext, input: CreateAddOn) {
    this.featureGateService.assertCatalogConfigurationAccess(context);
    return this.repository.createAddOn(input);
  }
  async createAppointmentCoupon(context: FeatureContext, input: CreateAppointmentCoupon) {
    this.featureGateService.assertCatalogConfigurationAccess(context);
    if (!input.code || input.code.length < 3) throw new Error('coupon code too short');
    return this.repository.createAppointmentCoupon(input);
  }
  async createIntakeForm(context: FeatureContext, input: CreateIntakeForm) {
    this.featureGateService.assertCatalogConfigurationAccess(context);
    return this.repository.createIntakeForm(input);
  }
  async listPublicCatalogView(accountId: string) {
    const [appointmentTypes, addOns, intakeForms] = await Promise.all([
      this.repository.listPublicAppointmentTypes(accountId),
      this.repository.listPublicAddOns(accountId),
      this.repository.listPublicIntakeForms(accountId)
    ]);
    return { appointmentTypes, addOns, intakeForms };
  }
}
