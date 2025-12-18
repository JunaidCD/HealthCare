import { addDays, setHours, setMinutes, format } from "date-fns";
import doctorMale from "@assets/generated_images/professional_doctor_avatar_male.png";
import doctorFemale from "@assets/generated_images/professional_doctor_avatar_female.png";
import patientMale from "@assets/generated_images/patient_avatar_male.png";

export type Role = "patient" | "doctor" | "admin" | "manager" | "it";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  specialty?: string;
  status: "active" | "inactive";
  joinedDate: string;
  rating?: number;
}

export interface Slot {
  id: string;
  doctorId: string;
  start: string;
  end: string;
  status: "available" | "booked" | "cancelled";
}

export interface Appointment {
  id: string;
  slotId: string;
  patientId: string;
  doctorId: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  history?: string[];
  type: "consultation" | "follow-up" | "therapy";
}

export interface SystemLog {
  id: string;
  level: "info" | "warning" | "error";
  message: string;
  timestamp: string;
  source: string;
}

export interface Feedback {
  id: string;
  patientId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  instructions: string;
  createdDate: string;
  expiryDate: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  method: "card" | "bank" | "wallet";
  date: string;
}

export interface BugReport {
  id: string;
  reportedBy: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved";
  date: string;
}

export interface DoctorQuality {
  doctorId: string;
  appointmentCount: number;
  avgRating: number;
  completionRate: number;
  patientSatisfaction: number;
}

export interface HealthMetric {
  id: string;
  metric: string;
  value: number | string;
  timestamp: string;
  status: "healthy" | "warning" | "critical";
}

const today = new Date();

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "patient@health.care",
    role: "patient",
    avatar: patientMale,
    status: "active",
    joinedDate: "2024-01-15",
  },
  {
    id: "u2",
    name: "Dr. Sarah Smith",
    email: "doctor@health.care",
    role: "doctor",
    avatar: doctorFemale,
    specialty: "Psychiatrist",
    status: "active",
    joinedDate: "2023-05-20",
    rating: 4.8,
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@health.care",
    role: "admin",
    status: "active",
    joinedDate: "2023-01-01",
  },
  {
    id: "u4",
    name: "Health Manager",
    email: "manager@health.care",
    role: "manager",
    status: "active",
    joinedDate: "2023-03-10",
  },
  {
    id: "u5",
    name: "IT Support",
    email: "it@health.care",
    role: "it",
    status: "active",
    joinedDate: "2023-02-15",
  },
  {
    id: "u6",
    name: "Dr. James Wilson",
    email: "james@health.care",
    role: "doctor",
    avatar: doctorMale,
    specialty: "Clinical Psychologist",
    status: "active",
    joinedDate: "2023-08-12",
    rating: 4.6,
  },
];

export const MOCK_SLOTS: Slot[] = [
  {
    id: "s1",
    doctorId: "u2",
    start: setHours(setMinutes(addDays(today, 1), 0), 9).toISOString(),
    end: setHours(setMinutes(addDays(today, 1), 30), 9).toISOString(),
    status: "available",
  },
  {
    id: "s2",
    doctorId: "u2",
    start: setHours(setMinutes(addDays(today, 1), 0), 10).toISOString(),
    end: setHours(setMinutes(addDays(today, 1), 30), 10).toISOString(),
    status: "booked",
  },
  {
    id: "s3",
    doctorId: "u6",
    start: setHours(setMinutes(addDays(today, 2), 0), 14).toISOString(),
    end: setHours(setMinutes(addDays(today, 2), 30), 14).toISOString(),
    status: "available",
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    slotId: "s2",
    patientId: "u1",
    doctorId: "u2",
    status: "scheduled",
    type: "consultation",
    notes: "Initial consultation for anxiety symptoms.",
    history: ["Patient reported difficulty sleeping."],
  },
];

export const MOCK_LOGS: SystemLog[] = [
  {
    id: "l1",
    level: "info",
    message: "System startup successful",
    timestamp: new Date().toISOString(),
    source: "System",
  },
  {
    id: "l2",
    level: "warning",
    message: "High memory usage detected",
    timestamp: addDays(new Date(), -1).toISOString(),
    source: "Server",
  },
];

export const MOCK_FEEDBACK: Feedback[] = [
  {
    id: "f1",
    patientId: "u1",
    rating: 5,
    comment: "Dr. Smith was very understanding and helpful.",
    date: addDays(new Date(), -2).toISOString(),
  },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "p1",
    appointmentId: "a1",
    doctorId: "u2",
    patientId: "u1",
    medications: [
      { name: "Sertraline", dosage: "50mg", frequency: "Once daily", duration: "30 days" },
      { name: "Melatonin", dosage: "5mg", frequency: "At bedtime", duration: "30 days" },
    ],
    instructions: "Take with food. Avoid alcohol. Report any side effects immediately.",
    createdDate: new Date().toISOString(),
    expiryDate: addDays(new Date(), 90).toISOString(),
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "py1",
    appointmentId: "a1",
    patientId: "u1",
    amount: 150,
    status: "completed",
    method: "card",
    date: new Date().toISOString(),
  },
];

export const MOCK_BUG_REPORTS: BugReport[] = [
  {
    id: "b1",
    reportedBy: "u4",
    title: "Login page slow on mobile",
    description: "Login takes 5+ seconds on mobile devices",
    severity: "medium",
    status: "in-progress",
    date: addDays(new Date(), -1).toISOString(),
  },
];

export const MOCK_HEALTH_METRICS: HealthMetric[] = [
  {
    id: "h1",
    metric: "CPU Usage",
    value: "42%",
    timestamp: new Date().toISOString(),
    status: "healthy",
  },
  {
    id: "h2",
    metric: "Memory Usage",
    value: "68%",
    timestamp: new Date().toISOString(),
    status: "warning",
  },
  {
    id: "h3",
    metric: "Database Response",
    value: "120ms",
    timestamp: new Date().toISOString(),
    status: "healthy",
  },
  {
    id: "h4",
    metric: "API Availability",
    value: "99.97%",
    timestamp: new Date().toISOString(),
    status: "healthy",
  },
];
