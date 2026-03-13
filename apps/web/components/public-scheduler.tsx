import Link from "next/link";
import { generateSlots, getPublicCatalog, resolveService, type SchedulerQuery } from "@/lib/public-scheduler";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function PublicScheduler({ query }: { query: SchedulerQuery }) {
  const catalog = getPublicCatalog();
  const selectedService = resolveService(query);
  const activeService = selectedService ?? (catalog.length === 1 ? catalog[0] : null);
  const selectedDate = query.date ?? "";
  const slots = activeService && selectedDate ? generateSlots(selectedDate, activeService.durationMinutes) : [];
  const multiMode = query.mode === "multi";

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Book an Appointment</h1>
      <section>
        <h2>1) Select service</h2>
        <ul>
          {catalog.map((service) => (
            <li key={service.id}>
              <Link href={`/schedule?service=${service.slug}`}>{service.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>2) Date and time</h2>
        {activeService ? (
          <>
            <p>
              Service: <strong>{activeService.name}</strong>
            </p>
            <form action="/schedule" style={{ display: "grid", gap: "0.5rem", maxWidth: 360 }}>
              <input type="hidden" name="service" value={activeService.slug} />
              <label htmlFor="date">Date</label>
              <input id="date" type="date" name="date" defaultValue={selectedDate} required />
              <button type="submit">Load available slots</button>
            </form>
          </>
        ) : (
          <p>Choose a visible public service to continue.</p>
        )}
      </section>

      <section>
        <h2>3) Slot selection</h2>
        {!slots.length ? (
          <p>No slots loaded yet.</p>
        ) : (
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
            {slots.map((slot) => (
              <li key={slot.startIso}>
                <button type="button" disabled={!slot.available} style={{ width: "100%" }}>
                  {formatTime(slot.startIso)} - {formatTime(slot.endIso)} {slot.available ? "" : "(unavailable)"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>4) Multi-time selection</h2>
        {activeService?.supportsMultiTime ? (
          <Link href={`/schedule?service=${activeService.slug}&date=${selectedDate}&mode=${multiMode ? "single" : "multi"}`}>
            {multiMode ? "Switch to single-time mode" : "Enable multi-time selection"}
          </Link>
        ) : (
          <p>Multi-time selection is not enabled for this service.</p>
        )}
        {multiMode && <p>Multi-time mode active: selected times will be reviewed before booking form entry.</p>}
      </section>

      <section>
        <h2>5) Recurring booking</h2>
        {activeService?.supportsRecurring ? (
          <details>
            <summary>Open recurring booking options</summary>
            <p>Recurring modal foundation: frequency, cadence, and end-date controls are scaffolded for Phase 3B.</p>
          </details>
        ) : (
          <p>Recurring booking is unavailable for this service.</p>
        )}
      </section>
    </main>
  );
}
