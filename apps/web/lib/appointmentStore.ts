export type AppointmentStatus = "booked" | "confirmed" | "cancelled";

export type Appointment = {
  id: string;
  clientName: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
};

export type CalendarState = {
  appointments: Appointment[];
  blockedSlots: string[];
};

export const STORE_KEY = "acuity-clone-appointment-loop";

export const DEFAULT_STATE: CalendarState = {
  appointments: [
    {
      id: "a1",
      clientName: "Jules Carter",
      email: "jules@example.com",
      service: "Discovery",
      date: "2026-03-18",
      time: "09:00",
      status: "confirmed"
    },
    {
      id: "a2",
      clientName: "Mina Patel",
      email: "mina@example.com",
      service: "Follow-up",
      date: "2026-03-18",
      time: "11:30",
      status: "booked"
    }
  ],
  blockedSlots: ["2026-03-18|15:00"]
};

export function slotKey(date: string, time: string): string {
  return `${date}|${time}`;
}

export function isSlotBlocked(state: CalendarState, date: string, time: string): boolean {
  return state.blockedSlots.includes(slotKey(date, time));
}

export function isSlotTaken(state: CalendarState, date: string, time: string): boolean {
  return state.appointments.some((appointment) =>
    appointment.status !== "cancelled" && appointment.date === date && appointment.time === time
  );
}

export function canBookSlot(state: CalendarState, date: string, time: string): boolean {
  return !isSlotBlocked(state, date, time) && !isSlotTaken(state, date, time);
}

export function toggleBlockedSlot(state: CalendarState, date: string, time: string): CalendarState {
  const key = slotKey(date, time);
  const exists = state.blockedSlots.includes(key);
  return {
    ...state,
    blockedSlots: exists ? state.blockedSlots.filter((slot) => slot !== key) : [...state.blockedSlots, key]
  };
}
