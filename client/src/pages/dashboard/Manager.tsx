import { Switch, Route } from "wouter";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Star } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function ManagerOverview() {
  const { appointments, feedback } = useData();

  const appointmentsByDay = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 6 },
    { name: 'Sat', count: 2 },
    { name: 'Sun', count: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue (Est.)</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">$45,231</div><p className="text-xs text-muted-foreground">+20.1% from last month</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Satisfaction</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">4.8/5.0</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Doctors</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">12</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Appointments</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{appointments.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appointmentsByDay}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function ManagerFeedback() {
  const { feedback } = useData();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Patient Feedback</h2>
      {feedback.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">No feedback yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {feedback.map((f) => (
            <Card key={f.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < f.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{format(parseISO(f.date), "MMM d, yyyy")}</span>
                </div>
                <p className="text-sm italic">"{f.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ManagerBugs() {
  const { bugReports, reportBug } = useData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");

  const handleReport = () => {
    if (title && description) {
      reportBug(title, description, severity);
      setTitle("");
      setDescription("");
      setSeverity("medium");
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bug Reports & Issues</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Brief issue title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Detailed description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select onValueChange={setSeverity} value={severity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleReport} className="w-full" disabled={!title || !description}>
              Submit Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {bugReports.map((bug) => (
                <div key={bug.id} className={`p-3 border rounded ${getSeverityColor(bug.severity)}`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{bug.title}</p>
                    <Badge variant="outline" className="text-xs">{bug.status}</Badge>
                  </div>
                  <p className="text-xs opacity-80 mb-1">{bug.description}</p>
                  <p className="text-xs opacity-60">{format(parseISO(bug.date), "MMM d, yyyy")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ManagerQuality() {
  const { users, getDoctorQuality } = useData();
  const doctors = users.filter((u) => u.role === "doctor");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Doctor Quality Metrics</h2>
      <div className="grid gap-4">
        {doctors.map((doc) => {
          const quality = getDoctorQuality(doc.id);
          return (
            <Card key={doc.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="font-semibold text-lg">{doc.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{quality.appointmentCount}</p>
                    <p className="text-xs text-muted-foreground">Appointments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{quality.avgRating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{quality.completionRate.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{quality.patientSatisfaction.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ManagerDashboard() {
  return (
    <Switch>
      <Route path="/dashboard/manager/feedback" component={ManagerFeedback} />
      <Route path="/dashboard/manager/bugs" component={ManagerBugs} />
      <Route path="/dashboard/manager/quality" component={ManagerQuality} />
      <Route path="/dashboard/manager" component={ManagerOverview} />
    </Switch>
  );
}
