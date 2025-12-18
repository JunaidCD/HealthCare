import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Slot,
  Appointment,
  SystemLog,
  Feedback,
  Prescription,
  Payment,
  BugReport,
  HealthMetric,
  DoctorQuality,
  RefillRequest,
  RescheduleRequest,
  MedicalRecord,
  MOCK_USERS,
  MOCK_SLOTS,
  MOCK_APPOINTMENTS,
  MOCK_LOGS,
  MOCK_FEEDBACK,
  MOCK_PRESCRIPTIONS,
  MOCK_PAYMENTS,
  MOCK_BUG_REPORTS,
  MOCK_HEALTH_METRICS,
  MOCK_REFILL_REQUESTS,
  MOCK_RESCHEDULE_REQUESTS,
  MOCK_MEDICAL_RECORDS,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  users: User[];
  slots: Slot[];
  appointments: Appointment[];
  logs: SystemLog[];
  feedback: Feedback[];
  prescriptions: Prescription[];
  payments: Payment[];
  bugReports: BugReport[];
  healthMetrics: HealthMetric[];
  refillRequests: RefillRequest[];
  rescheduleRequests: RescheduleRequest[];
  medicalRecords: MedicalRecord[];
  addSlot: (slot: Omit<Slot, "id">) => void;
  deleteSlot: (slotId: string) => void;
  bookAppointment: (slotId: string, patientId: string, notes?: string) => void;
  updateAppointmentNotes: (appointmentId: string, notes: string) => void;
  addLog: (message: string, level: "info" | "warning" | "error", source: string) => void;
  approveUser: (userId: string) => void;
  addPrescription: (prescription: Omit<Prescription, "id">) => void;
  makePayment: (appointmentId: string, patientId: string, amount: number, method: string) => void;
  reportBug: (title: string, description: string, severity: string) => void;
  getDoctorQuality: (doctorId: string) => DoctorQuality;
  requestRefill: (prescriptionId: string, patientId: string, doctorId: string, medicationName: string, reason: string) => void;
  approveRefill: (refillId: string, doctorNotes: string) => void;
  rejectRefill: (refillId: string, doctorNotes: string) => void;
  requestReschedule: (appointmentId: string, patientId: string, doctorId: string, requestedDate: string, reason: string) => void;
  approveReschedule: (rescheduleId: string) => void;
  rejectReschedule: (rescheduleId: string) => void;
  uploadMedicalRecord: (patientId: string, title: string, type: "lab-report" | "test-result" | "scan" | "document" | "prescription") => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem("hc_users") || JSON.stringify(MOCK_USERS)));
  const [slots, setSlots] = useState<Slot[]>(() => JSON.parse(localStorage.getItem("hc_slots") || JSON.stringify(MOCK_SLOTS)));
  const [appointments, setAppointments] = useState<Appointment[]>(() => JSON.parse(localStorage.getItem("hc_appointments") || JSON.stringify(MOCK_APPOINTMENTS)));
  const [logs, setLogs] = useState<SystemLog[]>(() => JSON.parse(localStorage.getItem("hc_logs") || JSON.stringify(MOCK_LOGS)));
  const [feedback, setFeedback] = useState<Feedback[]>(() => JSON.parse(localStorage.getItem("hc_feedback") || JSON.stringify(MOCK_FEEDBACK)));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => JSON.parse(localStorage.getItem("hc_prescriptions") || JSON.stringify(MOCK_PRESCRIPTIONS)));
  const [payments, setPayments] = useState<Payment[]>(() => JSON.parse(localStorage.getItem("hc_payments") || JSON.stringify(MOCK_PAYMENTS)));
  const [bugReports, setBugReports] = useState<BugReport[]>(() => JSON.parse(localStorage.getItem("hc_bugs") || JSON.stringify(MOCK_BUG_REPORTS)));
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(() => JSON.parse(localStorage.getItem("hc_health") || JSON.stringify(MOCK_HEALTH_METRICS)));
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>(() => JSON.parse(localStorage.getItem("hc_refills") || JSON.stringify(MOCK_REFILL_REQUESTS)));
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>(() => JSON.parse(localStorage.getItem("hc_reschedules") || JSON.stringify(MOCK_RESCHEDULE_REQUESTS)));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => JSON.parse(localStorage.getItem("hc_records") || JSON.stringify(MOCK_MEDICAL_RECORDS)));

  const { toast } = useToast();

  useEffect(() => localStorage.setItem("hc_users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("hc_slots", JSON.stringify(slots)), [slots]);
  useEffect(() => localStorage.setItem("hc_appointments", JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem("hc_logs", JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem("hc_feedback", JSON.stringify(feedback)), [feedback]);
  useEffect(() => localStorage.setItem("hc_prescriptions", JSON.stringify(prescriptions)), [prescriptions]);
  useEffect(() => localStorage.setItem("hc_payments", JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem("hc_bugs", JSON.stringify(bugReports)), [bugReports]);
  useEffect(() => localStorage.setItem("hc_health", JSON.stringify(healthMetrics)), [healthMetrics]);
  useEffect(() => localStorage.setItem("hc_refills", JSON.stringify(refillRequests)), [refillRequests]);
  useEffect(() => localStorage.setItem("hc_reschedules", JSON.stringify(rescheduleRequests)), [rescheduleRequests]);
  useEffect(() => localStorage.setItem("hc_records", JSON.stringify(medicalRecords)), [medicalRecords]);

  const addSlot = (slotData: Omit<Slot, "id">) => {
    const newSlot: Slot = { ...slotData, id: Math.random().toString(36).substr(2, 9) };
    setSlots((prev) => [...prev, newSlot]);
    addLog(`New slot created for doctor ${slotData.doctorId}`, "info", "Admin");
    toast({ title: "Slot Created", description: "The appointment slot is now available." });
  };

  const deleteSlot = (slotId: string) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    addLog(`Slot ${slotId} deleted`, "info", "Admin");
    toast({ title: "Slot Deleted", description: "The appointment slot has been removed." });
  };

  const bookAppointment = (slotId: string, patientId: string, notes?: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;

    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, status: "booked" } : s)));

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
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u)));
    addLog(`User ${userId} approved`, "info", "Admin");
  };

  const addPrescription = (prescriptionData: Omit<Prescription, "id">) => {
    const newPrescription: Prescription = { ...prescriptionData, id: Math.random().toString(36).substr(2, 9) };
    setPrescriptions((prev) => [...prev, newPrescription]);
    addLog(`Prescription created for patient ${prescriptionData.patientId}`, "info", "Doctor");
    toast({ title: "Prescription Generated", description: "Prescription has been created successfully." });
  };

  const makePayment = (appointmentId: string, patientId: string, amount: number, method: string) => {
    const newPayment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      appointmentId,
      patientId,
      amount,
      status: "completed",
      method: method as "card" | "bank" | "wallet",
      date: new Date().toISOString(),
    };
    setPayments((prev) => [...prev, newPayment]);
    addLog(`Payment of $${amount} received from patient ${patientId}`, "info", "System");
    toast({ title: "Payment Successful", description: `$${amount} has been charged.` });
  };

  const reportBug = (title: string, description: string, severity: string) => {
    const newBug: BugReport = {
      id: Math.random().toString(36).substr(2, 9),
      reportedBy: "u4",
      title,
      description,
      severity: severity as "low" | "medium" | "high" | "critical",
      status: "open",
      date: new Date().toISOString(),
    };
    setBugReports((prev) => [...prev, newBug]);
    addLog(`New bug report: ${title}`, "warning", "Manager");
    toast({ title: "Bug Reported", description: "Thank you for reporting this issue." });
  };

  const getDoctorQuality = (doctorId: string): DoctorQuality => {
    const doctorAppts = appointments.filter((a) => a.doctorId === doctorId);
    const doctorFeedback = feedback.filter((f) => doctorAppts.some((a) => a.patientId === f.patientId));
    
    return {
      doctorId,
      appointmentCount: doctorAppts.length,
      avgRating: doctorFeedback.length > 0 ? doctorFeedback.reduce((acc, f) => acc + f.rating, 0) / doctorFeedback.length : 0,
      completionRate: doctorAppts.length > 0 ? (doctorAppts.filter((a) => a.status === "completed").length / doctorAppts.length) * 100 : 0,
      patientSatisfaction: doctorFeedback.length > 0 ? (doctorFeedback.reduce((acc, f) => acc + f.rating, 0) / (doctorFeedback.length * 5)) * 100 : 0,
    };
  };

  const requestRefill = (prescriptionId: string, patientId: string, doctorId: string, medicationName: string, reason: string) => {
    const newRefill: RefillRequest = {
      id: Math.random().toString(36).substr(2, 9),
      prescriptionId,
      patientId,
      doctorId,
      medicationName,
      reason,
      status: "pending",
      requestDate: new Date().toISOString(),
    };
    setRefillRequests((prev) => [...prev, newRefill]);
    addLog(`Refill request for ${medicationName}`, "info", "Patient");
    toast({ title: "Refill Requested", description: "Your medication refill request has been submitted." });
  };

  const approveRefill = (refillId: string, doctorNotes: string) => {
    setRefillRequests((prev) => prev.map((r) => r.id === refillId ? { ...r, status: "approved", responseDate: new Date().toISOString(), doctorNotes } : r));
    addLog(`Refill approved for prescription`, "info", "Doctor");
    toast({ title: "Refill Approved", description: "Medication refill has been approved." });
  };

  const rejectRefill = (refillId: string, doctorNotes: string) => {
    setRefillRequests((prev) => prev.map((r) => r.id === refillId ? { ...r, status: "rejected", responseDate: new Date().toISOString(), doctorNotes } : r));
    addLog(`Refill rejected`, "warning", "Doctor");
    toast({ title: "Refill Rejected", description: "Medication refill request has been rejected." });
  };

  const requestReschedule = (appointmentId: string, patientId: string, doctorId: string, requestedDate: string, reason: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    const newReschedule: RescheduleRequest = {
      id: Math.random().toString(36).substr(2, 9),
      appointmentId,
      patientId,
      doctorId,
      originalDate: apt?.slotId ? slots.find((s) => s.id === apt.slotId)?.start || "" : "",
      requestedDate,
      reason,
      status: "pending",
      requestDate: new Date().toISOString(),
    };
    setRescheduleRequests((prev) => [...prev, newReschedule]);
    addLog(`Appointment reschedule requested`, "info", "Patient");
    toast({ title: "Reschedule Requested", description: "Your appointment reschedule request has been submitted." });
  };

  const approveReschedule = (rescheduleId: string) => {
    setRescheduleRequests((prev) => prev.map((r) => r.id === rescheduleId ? { ...r, status: "approved", responseDate: new Date().toISOString() } : r));
    addLog(`Appointment rescheduled`, "info", "Doctor");
    toast({ title: "Reschedule Approved", description: "Appointment has been rescheduled." });
  };

  const rejectReschedule = (rescheduleId: string) => {
    setRescheduleRequests((prev) => prev.map((r) => r.id === rescheduleId ? { ...r, status: "rejected", responseDate: new Date().toISOString() } : r));
    addLog(`Reschedule request rejected`, "warning", "Doctor");
    toast({ title: "Reschedule Rejected", description: "Reschedule request could not be approved." });
  };

  const uploadMedicalRecord = (patientId: string, title: string, type: "lab-report" | "test-result" | "scan" | "document" | "prescription") => {
    const newRecord: MedicalRecord = {
      id: Math.random().toString(36).substr(2, 9),
      patientId,
      title,
      type,
      uploadDate: new Date().toISOString(),
      fileSize: Math.floor(Math.random() * 5000) + 1000,
      status: "uploaded",
    };
    setMedicalRecords((prev) => [...prev, newRecord]);
    addLog(`Medical record uploaded: ${title}`, "info", "Patient");
    toast({ title: "Record Uploaded", description: `${title} has been uploaded to your records.` });
  };

  return (
    <DataContext.Provider
      value={{
        users,
        slots,
        appointments,
        logs,
        feedback,
        prescriptions,
        payments,
        bugReports,
        healthMetrics,
        refillRequests,
        rescheduleRequests,
        medicalRecords,
        addSlot,
        deleteSlot,
        bookAppointment,
        updateAppointmentNotes,
        addLog,
        approveUser,
        addPrescription,
        makePayment,
        reportBug,
        getDoctorQuality,
        requestRefill,
        approveRefill,
        rejectRefill,
        requestReschedule,
        approveReschedule,
        rejectReschedule,
        uploadMedicalRecord,
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
