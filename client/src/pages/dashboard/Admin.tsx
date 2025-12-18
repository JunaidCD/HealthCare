import { Switch, Route, useLocation } from "wouter";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { setHours, setMinutes, format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

function AdminOverview() {
  const { users, slots, appointments } = useData();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Slots</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{slots.filter(s => s.status === 'available').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Bookings</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{slots.filter(s => s.status === 'booked').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Appointments</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{appointments.length}</div></CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminUsers() {
  const { users, approveUser } = useData();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell className="capitalize text-xs"><Badge variant="outline">{u.role}</Badge></TableCell>
                  <TableCell><Badge variant={u.status === "active" ? "outline" : "secondary"}>{u.status}</Badge></TableCell>
                  <TableCell>
                    {u.status !== "active" && (
                      <Button size="sm" onClick={() => approveUser(u.id)}>Approve</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminSlots() {
  const { users, slots, addSlot } = useData();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const doctors = users.filter((u) => u.role === "doctor");

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const startDate = new Date(date);
    const start = setHours(setMinutes(startDate, minutes), hours);
    const end = setMinutes(start, minutes + 30);

    addSlot({ doctorId: selectedDoctor, start: start.toISOString(), end: end.toISOString(), status: "available" });
    setSelectedDoctor("");
    setDate("");
    setTime("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Slot Management</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Doctor</label>
                <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
                  <SelectTrigger><SelectValue placeholder="Select Doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name} ({d.specialty})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Slot</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {slots.slice(-10).reverse().map((s) => (
                <div key={s.id} className="flex justify-between items-center text-sm p-2 border rounded bg-muted/20">
                  <span>{format(parseISO(s.start), "MMM d, p")}</span>
                  <Badge variant="outline" className="text-xs">{s.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/users" component={AdminUsers} />
      <Route path="/slots" component={AdminSlots} />
      <Route path="" component={AdminOverview} />
    </Switch>
  );
}
