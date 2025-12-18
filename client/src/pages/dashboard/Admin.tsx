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
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck, 
  UserX,
  Search,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminOverview() {
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

export function AdminUsers() {
  const { users, approveUser } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    // In a real app, this would call an API
    console.log(`Toggling user ${userId} status to ${newStatus}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      // In a real app, this would call an API
      console.log(`Deleting user ${userId}`);
    }
  };

  const handleViewUser = (user: any) => {
    alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}\n\nIn a real app, this would open a detailed view modal.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="it">IT Staff</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell className="capitalize text-xs">
                    <Badge 
                      variant="outline" 
                      className={
                        u.role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                        u.role === "doctor" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                        u.role === "patient" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        u.role === "manager" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={u.status === "active" ? "outline" : "secondary"}
                      className={
                        u.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300" :
                        u.status === "inactive" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewUser(u)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(u.id, u.status)}>
                          {u.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        {u.status !== "active" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => approveUser(u.id)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export function AdminSlots() {
  const { users, slots, addSlot, deleteSlot } = useData();
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

    // Check for slot conflicts and limit
    const doctorSlots = slots.filter(s => s.doctorId === selectedDoctor);
    const sameDaySlots = doctorSlots.filter(s => {
      const slotDate = new Date(s.start);
      return slotDate.toDateString() === startDate.toDateString();
    });

    // Check time conflict (allowing 30-minute slots with no overlap)
    const hasTimeConflict = sameDaySlots.some(s => {
      const existingStart = new Date(s.start);
      const existingEnd = new Date(s.end);
      return (start >= existingStart && start < existingEnd) || 
             (end > existingStart && end <= existingEnd);
    });

    // Check daily limit (3 slots per doctor per day)
    const dailySlotCount = sameDaySlots.length;
    const dailyLimitReached = dailySlotCount >= 3;

    if (hasTimeConflict) {
      alert("Time conflict: This time slot overlaps with an existing slot for the same doctor. Please choose a different time.");
      return;
    }

    if (dailyLimitReached) {
      alert("Daily limit reached: Maximum 3 slots per day allowed for each doctor. Please choose a different date.");
      return;
    }

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
                <div key={s.id} className="flex justify-between items-center text-sm p-2 border rounded bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span>{format(parseISO(s.start), "MMM d, p")}</span>
                    <Badge variant="outline" className="text-xs">{s.status}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this slot? This action cannot be undone.")) {
                        deleteSlot(s.id);
                      }
                    }}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { ReminderManagement } from './Admin/ReminderManagement';

export function AdminDashboard() {
  return <AdminOverview />;
}
