import { type CapabilityGateDecision, type IntegrationCapability, type IntegrationGatingContext } from './types.js';
export declare function evaluateIntegrationCapability(capability: IntegrationCapability, context: IntegrationGatingContext): CapabilityGateDecision;
