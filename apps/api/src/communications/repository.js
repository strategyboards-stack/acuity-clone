import crypto from 'node:crypto';

const now = () => new Date();

export class InMemoryCommunicationRepository {
  #events = new Map();
  #attempts = [];

  create(input, status) {
    const createdAt = now();
    const event = {
      id: crypto.randomUUID(),
      appointmentId: input.appointmentId,
      accountId: input.accountId,
      channel: input.channel,
      purpose: input.purpose,
      scheduledFor: input.scheduledFor,
      status,
      payload: input.payload,
      attempts: 0,
      maxAttempts: input.channel === 'SMS_REMINDER' ? 3 : 2,
      createdAt,
      updatedAt: createdAt,
    };
    this.#events.set(event.id, event);
    return event;
  }

  save(event) {
    event.updatedAt = now();
    this.#events.set(event.id, event);
    return event;
  }

  addAttempt(attempt) {
    this.#attempts.push(attempt);
  }

  findById(eventId) {
    return this.#events.get(eventId);
  }

  listDueEvents(atOrBefore) {
    return [...this.#events.values()].filter(
      (event) => event.status === 'SCHEDULED' && event.scheduledFor <= atOrBefore,
    );
  }

  listByAppointment(appointmentId) {
    return [...this.#events.values()]
      .filter((event) => event.appointmentId === appointmentId)
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
  }

  listAttempts(eventId) {
    return this.#attempts.filter((attempt) => attempt.eventId === eventId);
  }
}
