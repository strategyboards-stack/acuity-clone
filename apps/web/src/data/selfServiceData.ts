import type { SelfServiceModel } from '@acuity/contracts';

export const seededSelfServiceData: Record<string, SelfServiceModel> = {
  'token-valid': {
    session: {
      sessionToken: 'token-valid',
      clientId: 'client_001',
      clientEmail: 'jamie@example.com',
      clientName: 'Jamie Rivera'
    },
    appointments: [
      {
        appointmentId: 'apt_upcoming_1',
        publicCode: 'UP-1111',
        serviceName: 'Initial Consultation',
        startsAtIso: '2027-03-20T14:00:00.000Z',
        timezone: 'America/New_York',
        status: 'booked'
      },
      {
        appointmentId: 'apt_past_1',
        publicCode: 'PA-2222',
        serviceName: 'Follow-up Session',
        startsAtIso: '2023-11-10T14:00:00.000Z',
        timezone: 'America/New_York',
        status: 'completed'
      }
    ],
    manageCodes: [
      {
        code: 'PKG-STARTER-25',
        type: 'package',
        status: 'active',
        remainingUses: 3
      },
      {
        code: 'GFT-ALPHA-99',
        type: 'gift-certificate',
        status: 'redeemed'
      }
    ]
  },
  'token-empty': {
    session: {
      sessionToken: 'token-empty',
      clientId: 'client_002',
      clientEmail: 'avery@example.com',
      clientName: 'Avery Chen'
    },
    appointments: [],
    manageCodes: []
  }
};
