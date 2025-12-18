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
  specialty?: string; // For doctors
  status: "active" | "inactive";
  joinedDate: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  start: string; // ISO string
  end: string; // ISO string
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

// Initial Data Generation
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
