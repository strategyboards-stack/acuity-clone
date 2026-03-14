import { evaluateCommunicationGate } from './gating.js';
import { StubResult } from './types.js';

export class CommunicationEngine {
  constructor(repository, adapters) {
    this.repository = repository;
    this.adapters = adapters;
  }

  scheduleCommunication(input, context) {
    const gate = evaluateCommunicationGate(input.channel, context);
    if (!gate.allowed) {
      return this.repository.create(input, 'LOCKED');
    }

    return this.repository.create(input, 'SCHEDULED');
  }

  async executeDueEvents(now) {
    const due = this.repository.listDueEvents(now);
    for (const event of due) {
      const adapter = this.adapters.get(event.channel);
      if (!adapter) {
        event.status = 'FAILED';
        event.lastErrorCode = 'ADAPTER_MISSING';
        event.lastErrorMessage = `No adapter for ${event.channel}`;
        this.repository.save(event);
        continue;
      }

      event.status = 'SENDING';
      this.repository.save(event);
      const result = await adapter.send(event);
      event.attempts += 1;

      if (result.ok) {
        event.status = 'SENT';
        event.lastErrorCode = undefined;
        event.lastErrorMessage = undefined;
        this.repository.addAttempt({ eventId: event.id, attempt: event.attempts, happenedAt: now, success: true });
        this.repository.save(event);
        continue;
      }

      this.repository.addAttempt({
        eventId: event.id,
        attempt: event.attempts,
        happenedAt: now,
        success: false,
        errorCode: result.code,
        errorMessage: result.message,
      });

      if (event.attempts >= event.maxAttempts) {
        event.status = 'FAILED';
      } else {
        event.status = 'SCHEDULED';
        event.scheduledFor = new Date(now.getTime() + 5 * 60 * 1000);
      }

      event.lastErrorCode = result.code;
      event.lastErrorMessage = result.message;
      this.repository.save(event);
    }
  }

  historyForAppointment(appointmentId) {
    return this.repository.listByAppointment(appointmentId).map((event) => ({
      eventId: event.id,
      appointmentId: event.appointmentId,
      channel: event.channel,
      purpose: event.purpose,
      status: event.status,
      attempts: event.attempts,
      scheduledFor: event.scheduledFor,
      lastErrorCode: event.lastErrorCode,
      lastErrorMessage: event.lastErrorMessage,
      updatedAt: event.updatedAt,
    }));
  }
}

export class StubClientEmailAdapter {
  channel = 'CLIENT_EMAIL';
  async send() {
    return StubResult.ok();
  }
}

export class StubReceiptEmailAdapter {
  channel = 'RECEIPT_EMAIL';
  async send() {
    return StubResult.ok();
  }
}

export class StubAdminAlertAdapter {
  channel = 'ADMIN_ALERT';
  async send() {
    return StubResult.ok();
  }
}

export class StubSmsReminderAdapter {
  channel = 'SMS_REMINDER';

  constructor(shouldFail = false) {
    this.shouldFail = shouldFail;
  }

  async send() {
    if (this.shouldFail) {
      return StubResult.fail('PROVIDER_UNAVAILABLE', 'SMS provider not configured yet');
    }
    return StubResult.ok();
  }
}
