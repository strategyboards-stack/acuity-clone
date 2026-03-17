"use client";

import { useEffect, useMemo, useState } from "react";
import {
  canBookSlot,
  DEFAULT_STATE,
  type CalendarState,
  STORE_KEY,
  toggleBlockedSlot,
  type Appointment
} from "@/lib/appointmentStore";

function readStore(): CalendarState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  const value = window.localStorage.getItem(STORE_KEY);
  if (!value) {
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(value) as CalendarState;
    return {
      appointments: parsed.appointments ?? [],
      blockedSlots: parsed.blockedSlots ?? []
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useAppointmentStore() {
  const [state, setState] = useState<CalendarState>(DEFAULT_STATE);

  useEffect(() => {
    setState(readStore());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      book(input: Omit<Appointment, "id" | "status">) {
        setState((previous) => {
          if (!canBookSlot(previous, input.date, input.time)) {
            return previous;
          }

          return {
            ...previous,
            appointments: [
              ...previous.appointments,
              {
                ...input,
                id: `a-${Date.now()}`,
                status: "booked"
              }
            ]
          };
        });
      },
      setStatus(id: string, status: Appointment["status"]) {
        setState((previous) => ({
          ...previous,
          appointments: previous.appointments.map((item) => (item.id === id ? { ...item, status } : item))
        }));
      },
      reschedule(id: string, date: string, time: string) {
        setState((previous) => {
          if (!canBookSlot(previous, date, time)) {
            return previous;
          }

          return {
            ...previous,
            appointments: previous.appointments.map((item) => (item.id === id ? { ...item, date, time } : item))
          };
        });
      },
      updateNotes(id: string, notes: string) {
        setState((previous) => ({
          ...previous,
          appointments: previous.appointments.map((item) => (item.id === id ? { ...item, notes } : item))
        }));
      },
      toggleBlock(date: string, time: string) {
        setState((previous) => toggleBlockedSlot(previous, date, time));
      }
    }),
    []
  );

  return { state, actions };
}
