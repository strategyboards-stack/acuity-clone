import type { FeatureContext } from './types.js';

export class FeatureGateService {
  assertCatalogConfigurationAccess(context: FeatureContext): void {
    const canAdminister = context.role === 'OWNER' || context.role === 'ADMIN';
    if (!canAdminister) throw new Error('Catalog configuration requires OWNER or ADMIN role.');
    if (!context.verificationReady) throw new Error('Catalog configuration requires verified account state.');
    if (!context.dependencyReady) throw new Error('Catalog configuration requires dependency-ready account state.');
    if (context.plan === 'FREE' && !context.inTrial) throw new Error('Catalog configuration is unavailable on free plans outside trial.');
  }
}
