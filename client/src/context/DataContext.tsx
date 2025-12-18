import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Slot,
  Appointment,
  SystemLog,
  Feedback,
  MOCK_USERS,
  MOCK_SLOTS,
  MOCK_APPOINTMENTS,
  MOCK_LOGS,
  MOCK_FEEDBACK,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  users: User[];
  slots: Slot[];
  appointments: Appointment[];
  logs: SystemLog[];
  feedback: Feedback[];
  addSlot: (slot: Omit<Slot, "id">) => void;
  bookAppointment: (slotId: string, patientId: string, notes?: string) => void;
  updateAppointmentNotes: (appointmentId: string, notes: string) => void;
  addLog: (message: string, level: "info" | "warning" | "error", source: string) => void;
  approveUser: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from local storage or mock data
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("hc_users");
    return stored ? JSON.parse(stored) : MOCK_USERS;
  });

  const [slots, setSlots] = useState<Slot[]>(() => {
    const stored = localStorage.getItem("hc_slots");
    return stored ? JSON.parse(stored) : MOCK_SLOTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = localStorage.getItem("hc_appointments");
    return stored ? JSON.parse(stored) : MOCK_APPOINTMENTS;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const stored = localStorage.getItem("hc_logs");
    return stored ? JSON.parse(stored) : MOCK_LOGS;
  });

  const [feedback, setFeedback] = useState<Feedback[]>(() => {
    const stored = localStorage.getItem("hc_feedback");
    return stored ? JSON.parse(stored) : MOCK_FEEDBACK;
  });

  const { toast } = useToast();

  // Persist to local storage whenever state changes
  useEffect(() => localStorage.setItem("hc_users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("hc_slots", JSON.stringify(slots)), [slots]);
  useEffect(() => localStorage.setItem("hc_appointments", JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem("hc_logs", JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem("hc_feedback", JSON.stringify(feedback)), [feedback]);

  const addSlot = (slotData: Omit<Slot, "id">) => {
    const newSlot: Slot = { ...slotData, id: Math.random().toString(36).substr(2, 9) };
    setSlots((prev) => [...prev, newSlot]);
    addLog(`New slot created for doctor ${slotData.doctorId}`, "info", "Admin");
    toast({ title: "Slot Created", description: "The appointment slot is now available." });
  };

  const bookAppointment = (slotId: string, patientId: string, notes?: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;

    // Update slot status
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, status: "booked" } : s))
    );

    // Create appointment
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      slotId,
      patientId,
      doctorId: slot.doctorId,
      status: "scheduled",
      type: "consultation",
      notes: notes || "",
      history: [],
    };
    setAppointments((prev) => [...prev, newAppointment]);
    addLog(`Appointment booked by patient ${patientId}`, "info", "System");
    toast({ title: "Booking Confirmed", description: "Your appointment has been scheduled." });
  };

  const updateAppointmentNotes = (appointmentId: string, notes: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, notes, history: [...(a.history || []), `Note updated: ${new Date().toISOString()}`] }
          : a
      )
    );
    toast({ title: "Notes Updated", description: "Treatment notes saved successfully." });
  };

  const addLog = (message: string, level: "info" | "warning" | "error", source: string) => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      level,
      message,
      timestamp: new Date().toISOString(),
      source,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const approveUser = (userId: string) => {
      setUsers(prev => prev.map(u => u.id === userId ? {...u, status: "active"} : u));
      addLog(`User ${userId} approved`, "info", "Admin");
  }

  return (
    <DataContext.Provider
      value={{
        users,
        slots,
        appointments,
        logs,
        feedback,
        addSlot,
        bookAppointment,
        updateAppointmentNotes,
        addLog,
        approveUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
