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
import { User, Calendar, ClipboardList } from "lucide-react";

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

export function DoctorDashboard() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/schedule" component={DoctorSchedule} />
      <Route path="/patients" component={DoctorPatients} />
      <Route path="" component={DoctorOverview} />
    </Switch>
  );
}
