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

export function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments, slots, users, updateAppointmentNotes } = useData();
  const [noteText, setNoteText] = useState("");

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const getPatient = (id: string) => users.find((u) => u.id === id);
  const getSlot = (id: string) => slots.find((s) => s.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Doctor's Portal</h2>
      </div>

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
                <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{myAppointments.filter(a => a.status === 'completed').length}</div>
            </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Appointments & Consultations</CardTitle>
          <CardDescription>Manage patient visits and update treatment notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myAppointments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No appointments found.</div>
            ) : (
                myAppointments.map((apt) => {
                const patient = getPatient(apt.patientId);
                const slot = getSlot(apt.slotId);

                return (
                    <div
                    key={apt.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border rounded-lg bg-card/50 hover:bg-card/80 transition-colors gap-4"
                    >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {patient?.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                        <h4 className="font-semibold text-lg">{patient?.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {slot ? format(parseISO(slot.start), "PPP p") : "Unknown Date"}
                        </p>
                        </div>
                    </div>

                    <div className="flex-1 md:px-8 w-full">
                        <p className="text-sm bg-muted/50 p-2 rounded border border-border/50 italic text-muted-foreground">
                         "{apt.notes || "No notes added yet."}"
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Badge variant={apt.status === "scheduled" ? "default" : "secondary"}>
                        {apt.status}
                        </Badge>
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setNoteText(apt.notes || "")}>
                            Update Notes
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                            <DialogTitle>Treatment Notes</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Patient History</label>
                                <div className="bg-muted p-3 rounded-md text-xs space-y-1 max-h-32 overflow-y-auto">
                                    {apt.history?.map((h, i) => <div key={i}>{h}</div>)}
                                    {(!apt.history || apt.history.length === 0) && <span className="text-muted-foreground">No history available</span>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Session Notes</label>
                                <Textarea
                                className="min-h-[150px]"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Record observations, diagnosis, and treatment plan..."
                                />
                            </div>
                            <Button 
                                onClick={() => {
                                    updateAppointmentNotes(apt.id, noteText);
                                }}
                                className="w-full"
                            >
                                Save to Record
                            </Button>
                            </div>
                        </DialogContent>
                        </Dialog>
                    </div>
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
