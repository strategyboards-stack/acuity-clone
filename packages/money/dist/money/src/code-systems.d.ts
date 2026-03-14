import type { MoneyCodeRegistry } from "@acuity/contracts";
export interface CodeSystemIntegrityResult {
    valid: boolean;
    collisions: string[];
}
export declare function validateCodeSystemSeparation(registry: MoneyCodeRegistry): CodeSystemIntegrityResult;
