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

function DoctorOverview() {
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

function DoctorSchedule() {
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

function DoctorPatients() {
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

function DoctorPrescriptions() {
  const { user } = useAuth();
  const { appointments, users, addPrescription, prescriptions } = useData();
  const [selectedApt, setSelectedApt] = useState("");
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [instructions, setInstructions] = useState("");

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const myPrescriptions = prescriptions.filter((p) => p.doctorId === user?.id);
  const getPatient = (id: string) => users.find((u) => u.id === id);

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleGeneratePrescription = () => {
    if (selectedApt && medications.some((m) => m.name)) {
      const apt = myAppointments.find((a) => a.id === selectedApt);
      if (apt) {
        addPrescription({
          appointmentId: selectedApt,
          doctorId: user!.id,
          patientId: apt.patientId,
          medications: medications.filter((m) => m.name),
          instructions,
          createdDate: new Date().toISOString(),
          expiryDate: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
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
                  <Input placeholder="Medicine name" value={med.name} onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].name = e.target.value;
                    setMedications(updated);
                  }} />
                  <Input placeholder="Dosage (e.g. 50mg)" value={med.dosage} onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].dosage = e.target.value;
                    setMedications(updated);
                  }} />
                  <Input placeholder="Frequency (e.g. Once daily)" value={med.frequency} onChange={(e) => {
                    const updated = [...medications];
                    updated[idx].frequency = e.target.value;
                    setMedications(updated);
                  }} />
                  <Input placeholder="Duration (e.g. 30 days)" value={med.duration} onChange={(e) => {
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
  return (
    <Switch>
      <Route path="/dashboard/doctor/schedule" component={DoctorSchedule} />
      <Route path="/dashboard/doctor/patients" component={DoctorPatients} />
      <Route path="/dashboard/doctor/prescriptions" component={DoctorPrescriptions} />
      <Route path="/dashboard/doctor" component={DoctorOverview} />
    </Switch>
  );
}
