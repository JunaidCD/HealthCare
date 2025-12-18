import { Switch, Route, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User as UserIcon, FileText, CreditCard } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { appointments, slots, users, prescriptions } = useData();
  const myAppointments = appointments.filter((a) => a.patientId === user?.id);
  const myPrescriptions = prescriptions.filter((p) => p.patientId === user?.id);
  const getDoctorName = (id: string) => users.find((u) => u.id === id)?.name || "Unknown";

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Medical History & Prescriptions</h2>
      <div className="grid gap-6">
        {/* Appointments */}
        <div>
          <h3 className="font-semibold mb-3">Past Appointments</h3>
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

        {/* Prescriptions */}
        <div>
          <h3 className="font-semibold mb-3">Active Prescriptions</h3>
          {myPrescriptions.length === 0 ? (
            <Card><CardContent className="pt-6 text-center text-muted-foreground">No prescriptions yet.</CardContent></Card>
          ) : (
            <div className="grid gap-4">
              {myPrescriptions.map((p) => (
                <Card key={p.id} className="border-blue-200 dark:border-blue-900">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Prescription from Dr. {getDoctorName(p.doctorId)}</CardTitle>
                        <CardDescription>{format(parseISO(p.createdDate), "PPP")}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-sm mb-2">Medications:</p>
                      <div className="space-y-2">
                        {p.medications.map((med, i) => (
                          <div key={i} className="text-sm p-2 bg-muted rounded border-l-4 border-primary">
                            <p className="font-medium">{med.name}</p>
                            <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency} • {med.duration}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Instructions:</p>
                      <p className="text-sm text-muted-foreground italic">{p.instructions}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PatientPayments() {
  const { user } = useAuth();
  const { appointments, payments, slots, users, makePayment } = useData();
  const [selectedApt, setSelectedApt] = useState("");
  const [amount, setAmount] = useState("150");
  const [method, setMethod] = useState("card");

  const myAppointments = appointments.filter((a) => a.patientId === user?.id);
  const myPayments = payments.filter((p) => p.patientId === user?.id);
  const unpaidApts = myAppointments.filter((a) => !myPayments.find((p) => p.appointmentId === a.id));

  const handlePayment = () => {
    if (selectedApt && user) {
      makePayment(selectedApt, user.id, parseFloat(amount), method);
      setSelectedApt("");
      setAmount("150");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payments</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Make Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Make Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Appointment</label>
              <Select onValueChange={setSelectedApt} value={selectedApt}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose appointment" />
                </SelectTrigger>
                <SelectContent>
                  {unpaidApts.map((apt) => {
                    const slot = slots.find((s) => s.id === apt.slotId);
                    return (
                      <SelectItem key={apt.id} value={apt.id}>
                        {slot ? format(parseISO(slot.start), "MMM d, p") : "Unknown"} - ${amount}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <div className="flex gap-2">
                <span className="text-sm pt-2">$</span>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select onValueChange={setMethod} value={method}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePayment} className="w-full" disabled={!selectedApt}>Complete Payment</Button>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments yet.</p>
              ) : (
                myPayments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-2 border rounded bg-green-50/10">
                    <div>
                      <p className="text-sm font-medium">${p.amount}</p>
                      <p className="text-xs text-muted-foreground">{format(parseISO(p.date), "MMM d, yyyy")}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">{p.status}</Badge>
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

export function PatientDashboard() {
  return (
    <Switch>
      <Route path="/book" component={PatientBook} />
      <Route path="/history" component={PatientHistory} />
      <Route path="/payments" component={PatientPayments} />
      <Route path="/" component={PatientOverview} />
    </Switch>
  );
}
