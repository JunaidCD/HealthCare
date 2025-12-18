import { Switch, Route } from "wouter";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Star } from "lucide-react";
import { format, parseISO } from "date-fns";

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

export function ManagerDashboard() {
  return (
    <Switch>
      <Route path="/feedback" component={ManagerFeedback} />
      <Route path="" component={ManagerOverview} />
    </Switch>
  );
}
