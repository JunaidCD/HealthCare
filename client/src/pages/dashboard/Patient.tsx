import { Switch, Route, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User as UserIcon, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

function PatientOverview() {
  const { user } = useAuth();
  const { appointments, slots, bookAppointment, users } = useData();
  const [bookingNote, setBookingNote] = useState("");

  const myAppointments = appointments.filter((a) => a.patientId === user?.id);
  const availableSlots = slots.filter((s) => s.status === "available");

  const getDoctorName = (id: string) => users.find((u) => u.id === id)?.name || "Unknown Doctor";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Lifetime history</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myAppointments.filter((a) => a.status === "scheduled").length}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No appointments yet.</p>
              ) : (
                myAppointments.slice(-3).map((apt) => {
                  const slot = slots.find((s) => s.id === apt.slotId);
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{getDoctorName(apt.doctorId)}</p>
                        <p className="text-xs text-muted-foreground">
                          {slot ? format(parseISO(slot.start), "PPP p") : "Unknown"}
                        </p>
                      </div>
                      <Badge variant={apt.status === "scheduled" ? "default" : "secondary"}>
                        {apt.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No slots available.</p>
              ) : (
                availableSlots.slice(0, 3).map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-2 border rounded text-sm">
                    <span>{getDoctorName(slot.doctorId)} - {format(parseISO(slot.start), "p")}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">Book</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Booking</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            {getDoctorName(slot.doctorId)} - {format(parseISO(slot.start), "PPP p")}
                          </p>
                          <Textarea placeholder="Reason for visit (optional)..." value={bookingNote} onChange={(e) => setBookingNote(e.target.value)} />
                          <Button onClick={() => { if (user) bookAppointment(slot.id, user.id, bookingNote); setBookingNote(""); }} className="w-full">Confirm</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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

function PatientBook() {
  const { user } = useAuth();
  const { slots, appointments, bookAppointment, users } = useData();
  const [bookingNote, setBookingNote] = useState("");
  const availableSlots = slots.filter((s) => s.status === "available");
  const getDoctorName = (id: string) => users.find((u) => u.id === id)?.name || "Unknown";

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Book an Appointment</h2>
      <div className="grid gap-4">
        {availableSlots.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">No available slots at this time.</CardContent></Card>
        ) : (
          availableSlots.map((slot) => (
            <Card key={slot.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{getDoctorName(slot.doctorId)}</h3>
                    <p className="text-sm text-muted-foreground">{format(parseISO(slot.start), "PPPP p")}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Book Now</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Book Appointment</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-medium">{getDoctorName(slot.doctorId)}</p>
                          <p className="text-sm text-muted-foreground">{format(parseISO(slot.start), "PPPP p")}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reason for visit</label>
                          <Textarea placeholder="Describe your symptoms or concerns..." value={bookingNote} onChange={(e) => setBookingNote(e.target.value)} />
                        </div>
                        <Button onClick={() => { if (user) bookAppointment(slot.id, user.id, bookingNote); setBookingNote(""); }} className="w-full">Confirm Booking</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function PatientHistory() {
  const { user } = useAuth();
  const { appointments, slots, users } = useData();
  const myAppointments = appointments.filter((a) => a.patientId === user?.id);
  const getDoctorName = (id: string) => users.find((u) => u.id === id)?.name || "Unknown";

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Medical History</h2>
      {myAppointments.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">No appointment history yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {myAppointments.map((apt) => {
            const slot = slots.find((s) => s.id === apt.slotId);
            return (
              <Card key={apt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{getDoctorName(apt.doctorId)}</CardTitle>
                      <CardDescription>{slot ? format(parseISO(slot.start), "PPPP p") : "Unknown Date"}</CardDescription>
                    </div>
                    <Badge>{apt.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Visit Notes</p>
                    <p className="text-sm text-muted-foreground italic">{apt.notes || "No notes available."}</p>
                  </div>
                  {apt.history && apt.history.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Progress History</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {apt.history.map((h, i) => <div key={i}>• {h}</div>)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PatientDashboard() {
  const [location] = useLocation();
  const path = location.split("/dashboard/patient")[1] || "";

  return (
    <Switch>
      <Route path="/book" component={PatientBook} />
      <Route path="/history" component={PatientHistory} />
      <Route path="" component={PatientOverview} />
    </Switch>
  );
}
