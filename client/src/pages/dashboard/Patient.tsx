import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User as UserIcon, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function PatientDashboard() {
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
        {/* Appointments List */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>Your scheduled and past visits.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No appointments found.</p>
              ) : (
                myAppointments.map((apt) => {
                  const slot = slots.find((s) => s.id === apt.slotId);
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getDoctorName(apt.doctorId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slot ? format(parseISO(slot.start), "PPP p") : "Date Unknown"}
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

        {/* Booking Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Book New Appointment</CardTitle>
            <CardDescription>Available slots from our specialists.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No slots available currently.</p>
              ) : (
                availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors group"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{getDoctorName(slot.doctorId)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(slot.start), "PPP")}
                      </p>
                      <p className="text-xs text-primary font-mono">
                        {format(parseISO(slot.start), "p")} - {format(parseISO(slot.end), "p")}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Book</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Booking</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            Booking with <strong>{getDoctorName(slot.doctorId)}</strong> on{" "}
                            {format(parseISO(slot.start), "PPP p")}
                          </p>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Reason for visit (Optional)</label>
                            <Textarea
                              value={bookingNote}
                              onChange={(e) => setBookingNote(e.target.value)}
                              placeholder="Briefly describe your symptoms..."
                            />
                          </div>
                          <Button
                            onClick={() => {
                              if (user) bookAppointment(slot.id, user.id, bookingNote);
                            }}
                            className="w-full"
                          >
                            Confirm Booking
                          </Button>
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
