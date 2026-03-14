import { describe, expect, it } from 'vitest';
import type { AppointmentActionEntry } from './client-self-service';

describe('client self-service contracts', () => {
  it('constrains action entry payload values', () => {
    const entry: AppointmentActionEntry = {
      identity: { appointmentId: 'apt_123', publicCode: 'ABCD-1234' },
      action: 'reschedule'
    };

    expect(entry.action).toBe('reschedule');
  });
});
