import { useEffect } from "react";
import { useData } from "@/context/DataContext";

export function useRealtimeUpdates() {
  const {
    appointments,
    bookAppointment,
    slots,
    payments,
    makePayment,
    users,
    prescriptions,
    addPrescription,
    bugReports,
    reportBug,
    addLog,
    refillRequests,
    requestRefill,
    approveRefill,
    rescheduleRequests,
    approveReschedule,
    uploadMedicalRecord,
    medicalRecords,
  } = useData();

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Simulate new appointments every 18 seconds
    intervals.push(
      setInterval(() => {
        if (Math.random() > 0.6) {
          const doctors = users.filter((u) => u.role === "doctor");
          const patients = users.filter((u) => u.role === "patient");
          const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
          const randomPatient = patients[Math.floor(Math.random() * patients.length)];
          const randomSlot = slots.find((s) => s.status === "available" && s.doctorId === randomDoctor?.id);

          if (randomSlot && randomDoctor && randomPatient) {
            bookAppointment(randomSlot.id, randomPatient.id, `Auto-scheduled checkup`);
            addLog(`New appointment auto-scheduled for ${randomPatient.name}`, "info", "System");
          }
        }
      }, 18000)
    );

    // Simulate new payments every 22 seconds
    intervals.push(
      setInterval(() => {
        if (Math.random() > 0.65 && appointments.length > 0) {
          const unpaidAppointments = appointments.filter((a) => !payments.find((p) => p.appointmentId === a.id));
          if (unpaidAppointments.length > 0) {
            const randomApt = unpaidAppointments[Math.floor(Math.random() * unpaidAppointments.length)];
            const amount = 150 + Math.floor(Math.random() * 200);
            makePayment(randomApt.id, randomApt.patientId, amount, ["card", "bank", "wallet"][Math.floor(Math.random() * 3)]);
            addLog(`Payment processed: $${amount}`, "info", "Payment");
          }
        }
      }, 22000)
    );

    // Simulate new prescriptions every 28 seconds
    intervals.push(
      setInterval(() => {
        if (Math.random() > 0.7 && appointments.length > 0 && users.length > 0) {
          const completedAppointments = appointments.filter((a) => a.status === "completed");
          if (completedAppointments.length > 0) {
            const randomApt = completedAppointments[Math.floor(Math.random() * completedAppointments.length)];
            const randomDoctor = users.find((u) => u.id === randomApt.doctorId);
            if (randomDoctor && !prescriptions.find(p => p.appointmentId === randomApt.id)) {
              const meds = [
                { name: "Amoxicillin", dosage: "500mg", frequency: "3x daily", duration: "7 days" },
                { name: "Ibuprofen", dosage: "200mg", frequency: "As needed", duration: "10 days" },
                { name: "Vitamin B12", dosage: "1000mcg", frequency: "Daily", duration: "30 days" },
              ];
              addPrescription({
                patientId: randomApt.patientId,
                doctorId: randomDoctor.id,
                appointmentId: randomApt.id,
                medications: [meds[Math.floor(Math.random() * meds.length)]],
                instructions: "Take with meals.",
                createdDate: new Date().toISOString(),
                expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              });
              addLog(`New prescription generated`, "info", "Prescription");
            }
          }
        }
      }, 28000)
    );

    // Simulate bug reports every 32 seconds
    intervals.push(
      setInterval(() => {
        if (Math.random() > 0.75) {
          const bugTitles = [
            "API timeout on appointment booking",
            "Payment processing delay",
            "Login intermittent failure",
            "Slow dashboard load",
            "Notification delivery issue",
          ];
          const randomTitle = bugTitles[Math.floor(Math.random() * bugTitles.length)];
          reportBug(randomTitle, "Auto-detected issue", ["low", "medium", "high"][Math.floor(Math.random() * 3)]);
          addLog(`Bug reported: ${randomTitle}`, "warning", "System");
        }
      }, 32000)
    );

    // Generate system logs every 9 seconds
    intervals.push(
      setInterval(() => {
        const logMessages = [
          "Database connection verified",
          "Cache synchronized",
          "SSL certificate valid",
          "Backup routine completed",
          "API health check: OK",
          "User session refreshed",
          "Memory cleanup executed",
        ];
        const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
        addLog(randomLog, "info", "System");
      }, 9000)
    );

    // Auto-approve refill requests every 40 seconds
    intervals.push(
      setInterval(() => {
        if (Math.random() > 0.7) {
          const pendingRefills = refillRequests.filter((r) => r.status === "pending");
          if (pendingRefills.length > 0) {
            const randomRefill = pendingRefills[Math.floor(Math.random() * pendingRefills.length)];
            approveRefill(randomRefill.id, "Approved - Continuing treatment");
            addLog(`Refill approved: ${randomRefill.medicationName}`, "info", "System");
          }
        }
      }, 40000)
    );

    // Auto-approve reschedule requests every 45 seconds
    intervals.push(
      setInterval(() => {
        if (Math.random() > 0.6 && rescheduleRequests.length > 0) {
          const pendingReschedules = rescheduleRequests.filter((r) => r.status === "pending");
          if (pendingReschedules.length > 0) {
            const randomReschedule = pendingReschedules[Math.floor(Math.random() * pendingReschedules.length)];
            approveReschedule(randomReschedule.id);
            addLog(`Appointment rescheduled successfully`, "info", "System");
          }
        }
      }, 45000)
    );

    // Auto-upload medical records every 50 seconds
    intervals.push(
      setInterval(() => {
        if (Math.random() > 0.75) {
          const patients = users.filter((u) => u.role === "patient");
          if (patients.length > 0) {
            const randomPatient = patients[Math.floor(Math.random() * patients.length)];
            const recordTypes: Array<"lab-report" | "test-result" | "scan" | "document" | "prescription"> = ["lab-report", "test-result", "scan", "document", "prescription"];
            const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
            const titles: Record<string, string> = {
              "lab-report": "Blood Test Report",
              "test-result": "COVID-19 Test Result",
              "scan": "CT Scan Results",
              "document": "Medical Certificate",
              "prescription": "Prescription Copy",
            };
            uploadMedicalRecord(randomPatient.id, titles[recordType], recordType);
            addLog(`Medical record uploaded`, "info", "System");
          }
        }
      }, 50000)
    );

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [appointments, payments, slots, users, prescriptions, bookAppointment, makePayment, addPrescription, reportBug, addLog, refillRequests, requestRefill, approveRefill, rescheduleRequests, approveReschedule, uploadMedicalRecord, medicalRecords]);
}
