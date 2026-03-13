/**
 * Phase 3A public scheduler foundation capability map.
 * This file intentionally keeps business capabilities in a single place so
 * later phases can extend safely without changing shell-level behavior.
 */
export const publicSchedulerFoundation = Object.freeze({
  phase: '3A',
  surfaces: ['public-scheduler'],
  includes: [
    'service-selection-shell',
    'date-time-selection-shell',
    'booking-form-shell',
    'confirmation-shell'
  ],
  excludes: ['phase-3b-enhancements']
});
