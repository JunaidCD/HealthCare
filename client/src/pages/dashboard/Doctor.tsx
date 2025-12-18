import { Switch, Route, useLocation } from "wouter";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { User, Calendar, ClipboardList, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export function DoctorOverview() {
  const { user } = useAuth();
  const { appointments, slots, users, updateAppointmentNotes } = useData();
  const [noteText, setNoteText] = useState("");

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const getPatient = (id: string) => users.find((u) => u.id === id);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myAppointments.filter(a => a.status === 'scheduled').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myAppointments.filter(a => a.status === 'completed').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myAppointments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myAppointments.filter(a => a.status === 'scheduled').length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            ) : (
              myAppointments.filter(a => a.status === 'scheduled').slice(0, 5).map((apt) => {
                const patient = getPatient(apt.patientId);
                const slot = slots.find((s) => s.id === apt.slotId);
                return (
                  <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-card/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground">{slot ? format(parseISO(slot.start), "MMM d, p") : "Unknown"}</p>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DoctorSchedule() {
  const { user } = useAuth();
  const { appointments, slots } = useData();

  const mySlots = slots.filter((s) => s.doctorId === user?.id);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Schedule</h2>
      {mySlots.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">No assigned time slots yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {mySlots.map((slot) => (
            <Card key={slot.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{format(parseISO(slot.start), "PPPP")}</p>
                    <p className="text-sm text-muted-foreground">{format(parseISO(slot.start), "p")} - {format(parseISO(slot.end), "p")}</p>
                  </div>
                  <Badge variant={slot.status === "available" ? "outline" : "default"}>{slot.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function DoctorPatients() {
  const { user } = useAuth();
  const { appointments, users, slots, updateAppointmentNotes } = useData();
  const [noteText, setNoteText] = useState("");

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const getPatient = (id: string) => users.find((u) => u.id === id);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Patients</h2>
      {myAppointments.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">No patient appointments yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {myAppointments.map((apt) => {
            const patient = getPatient(apt.patientId);
            const slot = slots.find((s) => s.id === apt.slotId);

            return (
              <Card key={apt.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {patient?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{patient?.name}</p>
                        <p className="text-xs text-muted-foreground">{slot ? format(parseISO(slot.start), "PPP p") : "Unknown"}</p>
                      </div>
                    </div>
                    <Badge>{apt.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic mb-4 p-2 bg-muted/50 rounded border">"{apt.notes || "No notes yet."}"</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" onClick={() => setNoteText(apt.notes || "")}>
                        Update Treatment Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Treatment Notes - {patient?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {apt.history && apt.history.length > 0 && (
                          <div>
                            <label className="text-sm font-medium">Previous Sessions</label>
                            <div className="bg-muted p-2 rounded text-xs space-y-1 max-h-24 overflow-y-auto">
                              {apt.history.map((h, i) => <div key={i}>• {h}</div>)}
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Session Notes</label>
                          <Textarea className="min-h-[150px]" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Record clinical observations, diagnosis, and treatment plan..." />
                        </div>
                        <Button onClick={() => { updateAppointmentNotes(apt.id, noteText); setNoteText(""); }} className="w-full">Save Notes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DoctorPrescriptions() {
  const { user } = useAuth();
  const { appointments, users, addPrescription, prescriptions, slots } = useData();
  const { toast } = useToast();
  const [selectedApt, setSelectedApt] = useState("");
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [instructions, setInstructions] = useState("");

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const myPrescriptions = prescriptions.filter((p) => p.doctorId === user?.id);
  const getPatient = (id: string) => users.find((u) => u.id === id);

  const MAX_MEDS_PER_PRESCRIPTION = 3;
  const ALLOWED_MEDICINES = [
    "Sertraline",
    "Fluoxetine",
    "Escitalopram",
    "Citalopram",
    "Paroxetine",
    "Venlafaxine",
    "Duloxetine",
    "Bupropion",
    "Amitriptyline",
    "Lorazepam",
    "Diazepam",
    "Clonazepam",
    "Melatonin",
    "Propranolol",
    "Hydroxyzine",
    "Risperidone",
    "Olanzapine",
    "Quetiapine",
  ];
  const FREQUENCY_OPTIONS = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
  ];

  const normalizeMedName = (name: string) => name.trim().toLowerCase();

  const parseDurationDays = (raw: string) => {
    const value = raw.trim().toLowerCase();
    const m = value.match(/^(\d+)\s*(day|days|d)?$/);
    if (!m) return null;
    const days = Number(m[1]);
    if (!Number.isFinite(days)) return null;
    return days;
  };

  const isValidDosage = (raw: string) => {
    const value = raw.trim().toLowerCase();
    if (!value) return false;
    return /\d/.test(value);
  };

  const showError = (title: string, description: string) => {
    toast({ title, description, variant: "destructive" });
  };

  const downloadPrescriptionPdf = (payload: {
    prescriptionId: string;
    doctorName: string;
    patientName: string;
    createdDate: string;
    appointmentDate?: string;
    medications: Array<{ name: string; dosage: string; frequency: string; duration: string }>;
    instructions: string;
  }) => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });

    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Prescription", 105, 18, { align: "center" });

    pdf.setDrawColor(180, 180, 180);
    pdf.line(15, 22, 195, 22);

    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Prescription ID: ${payload.prescriptionId}`, 15, 30);
    pdf.text(`Doctor: ${payload.doctorName}`, 15, 37);
    pdf.text(`Patient: ${payload.patientName}`, 15, 44);
    pdf.text(`Created: ${format(parseISO(payload.createdDate), "PPP")}`, 15, 51);
    if (payload.appointmentDate) {
      pdf.text(`Appointment: ${payload.appointmentDate}`, 15, 58);
    }

    let y = payload.appointmentDate ? 70 : 64;

    pdf.setFontSize(13);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Medications", 15, y);
    y += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    payload.medications.forEach((m, idx) => {
      const block = [
        `${idx + 1}. ${m.name}`,
        `Dosage: ${m.dosage}`,
        `Frequency: ${m.frequency}`,
        `Duration: ${m.duration} day(s)`,
      ];
      block.forEach((line) => {
        pdf.text(line, 18, y);
        y += 5;
      });
      y += 2;
    });

    if (y > 220) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(13);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Instructions", 15, y);
    y += 6;

    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    const lines = pdf.splitTextToSize(payload.instructions, 175);
    pdf.text(lines, 15, y);

    pdf.setFontSize(8);
    pdf.setTextColor(110, 110, 110);
    pdf.text("Generated by MediCare+", 105, 290, { align: "center" });

    const safePatient = payload.patientName.replace(/[^a-z0-9\-_. ]/gi, "_");
    pdf.save(`Prescription_${safePatient}_${payload.prescriptionId}.pdf`);
  };

  const handleAddMedication = () => {
    const filled = medications.filter((m) => m.name.trim()).length;
    if (filled >= MAX_MEDS_PER_PRESCRIPTION) {
      showError(
        "Medication limit reached",
        `You can prescribe up to ${MAX_MEDS_PER_PRESCRIPTION} medicines in one prescription.`
      );
      return;
    }

    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleGeneratePrescription = () => {
    if (!selectedApt) {
      showError("Missing appointment", "Please select a patient appointment before generating a prescription.");
      return;
    }

    const selectedMeds = medications
      .map((m) => ({
        name: m.name.trim(),
        dosage: m.dosage.trim(),
        frequency: m.frequency.trim(),
        duration: m.duration.trim(),
      }))
      .filter((m) => m.name);

    if (selectedMeds.length === 0) {
      showError("No medication added", "Please add at least one medicine.");
      return;
    }

    if (selectedMeds.length > MAX_MEDS_PER_PRESCRIPTION) {
      showError(
        "Too many medicines",
        `Only ${MAX_MEDS_PER_PRESCRIPTION} medicines are allowed per prescription.`
      );
      return;
    }

    const normalizedNames = selectedMeds.map((m) => normalizeMedName(m.name));
    const hasDuplicates = new Set(normalizedNames).size !== normalizedNames.length;
    if (hasDuplicates) {
      showError("Duplicate medicine", "Please remove duplicate medicine entries.");
      return;
    }

    const notAllowed = selectedMeds.find(
      (m) => !ALLOWED_MEDICINES.some((x) => normalizeMedName(x) === normalizeMedName(m.name))
    );
    if (notAllowed) {
      showError(
        "Medicine not allowed",
        `"${notAllowed.name}" is not in the allowed list. Please select a valid medicine.`
      );
      return;
    }

    const invalid = selectedMeds.find((m) => {
      const days = parseDurationDays(m.duration);
      const durationOk = days !== null && days >= 1 && days <= 90;
      const frequencyOk = FREQUENCY_OPTIONS.includes(m.frequency);
      return !isValidDosage(m.dosage) || !frequencyOk || !durationOk;
    });
    if (invalid) {
      showError(
        "Invalid medication details",
        "Each medicine must include a dosage, a valid frequency, and a duration (1-90 days)."
      );
      return;
    }

    if (instructions.trim().length < 10) {
      showError("Instructions required", "Please provide instructions (at least 10 characters).");
      return;
    }

    const apt = myAppointments.find((a) => a.id === selectedApt);
    if (!apt) {
      showError("Appointment not found", "Selected appointment is invalid.");
      return;
    }

    if (selectedMeds.some((m) => m.frequency === "As needed" && /every\s*\d+/i.test(m.frequency))) {
      showError("Invalid frequency", "Please choose either a fixed schedule or 'As needed'.");
      return;
    }

    if (selectedApt && selectedMeds.some((m) => m.name)) {
      const apt = myAppointments.find((a) => a.id === selectedApt);
      if (apt) {
        const patient = getPatient(apt.patientId);
        const slot = slots.find((s) => s.id === apt.slotId);
        const createdDate = new Date().toISOString();

        const pdfPrescriptionId = Math.random().toString(36).substr(2, 9);

        addPrescription({
          appointmentId: selectedApt,
          doctorId: user!.id,
          patientId: apt.patientId,
          medications: selectedMeds,
          instructions: instructions.trim(),
          createdDate,
          expiryDate: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        });

        downloadPrescriptionPdf({
          prescriptionId: pdfPrescriptionId,
          doctorName: `Dr. ${user?.name || ""}`.trim(),
          patientName: patient?.name || "Patient",
          createdDate,
          appointmentDate: slot ? format(parseISO(slot.start), "PPP p") : undefined,
          medications: selectedMeds.map((m) => ({
            ...m,
            duration: String(parseDurationDays(m.duration) ?? m.duration).trim(),
          })),
          instructions: instructions.trim(),
        });

        setSelectedApt("");
        setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
        setInstructions("");
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Generate Prescriptions</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Prescription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Appointment</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={selectedApt}
                onChange={(e) => setSelectedApt(e.target.value)}
              >
                <option value="">Select appointment</option>
                {myAppointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {getPatient(a.patientId)?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <p className="font-medium text-sm">Medications</p>
              {medications.map((med, idx) => (
                <div key={idx} className="space-y-2 p-3 border rounded bg-muted/20">
                  <Select
                    value={med.name}
                    onValueChange={(value) => {
                      const updated = [...medications];
                      updated[idx].name = value;
                      setMedications(updated);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALLOWED_MEDICINES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Dosage (e.g. 50mg)" value={med.dosage} onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].dosage = e.target.value;
                    setMedications(updated);
                  }} />
                  <Select
                    value={med.frequency}
                    onValueChange={(value) => {
                      const updated = [...medications];
                      updated[idx].frequency = value;
                      setMedications(updated);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Duration in days (1-90)" value={med.duration} onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].duration = e.target.value;
                    setMedications(updated);
                  }} />
                </div>
              ))}
              <Button onClick={handleAddMedication} variant="outline" className="w-full text-xs">+ Add Medication</Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Instructions</label>
              <Textarea placeholder="e.g., Take with food, avoid alcohol..." value={instructions} onChange={(e) => setInstructions(e.target.value)} className="min-h-[80px]" />
            </div>

            <Button onClick={handleGeneratePrescription} className="w-full" disabled={!selectedApt || !medications.some((m) => m.name)}>
              Generate Prescription
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {myPrescriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No prescriptions generated yet.</p>
              ) : (
                myPrescriptions.map((p) => (
                  <div key={p.id} className="p-3 border rounded bg-blue-50/10 border-blue-200/30">
                    <p className="font-medium text-sm">{getPatient(p.patientId)?.name}</p>
                    <p className="text-xs text-muted-foreground">{p.medications.length} medication(s)</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(parseISO(p.createdDate), "MMM d, yyyy")}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DoctorDashboard() {
  return <DoctorOverview />;
}
