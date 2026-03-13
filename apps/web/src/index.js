import { PHASE_ONE_STATUS } from '@acuity/contracts';

export function getPhaseOneBanner() {
  return `${PHASE_ONE_STATUS.name} (${PHASE_ONE_STATUS.id})`;
}
