import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { addDays, setHours, setMinutes, format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function AdminDashboard() {
  const { users, slots, addSlot, approveUser } = useData();
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
    const end = setMinutes(start, minutes + 30); // 30 min slots default

    addSlot({
      doctorId: selectedDoctor,
      start: start.toISOString(),
      end: end.toISOString(),
      status: "available",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user roles and approvals.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">{u.role}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === "active" ? "outline" : "secondary"}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.status !== "active" && (
                        <Button size="sm" variant="ghost" onClick={() => approveUser(u.id)}>
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Slot Creation */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Create Appointment Slots</CardTitle>
            <CardDescription>Assign time slots to doctors.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Doctor</label>
                <Select onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input type="time" onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Publish Slot
              </Button>
            </form>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Recent Slots</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {slots.slice(-5).reverse().map((s) => (
                  <div key={s.id} className="text-sm p-2 border rounded flex justify-between bg-muted/20">
                    <span>{format(parseISO(s.start), "MMM d, HH:mm")}</span>
                    <Badge variant="outline" className="text-xs">{s.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
