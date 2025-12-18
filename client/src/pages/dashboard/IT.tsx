import { Switch, Route } from "wouter";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { format, parseISO } from "date-fns";

function ITLogs() {
  const { logs } = useData();

  const getIcon = (level: string) => {
    switch (level) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <Info className="h-4 w-4 text-yellow-500" />;
      case "info": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Terminal className="h-4 w-4" />;
    }
  };

  const getColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-500";
      case "warning": return "text-yellow-500";
      case "info": return "text-green-500";
      default: return "text-foreground";
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <Card className="flex-1 bg-black border-slate-800 font-mono text-sm shadow-2xl overflow-hidden flex flex-col">
        <CardHeader className="bg-slate-900/50 border-b border-slate-800 py-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-normal text-slate-300">System Logs /var/log/medicare.log</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative">
          <div className="absolute inset-0 overflow-y-auto p-4 space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors text-xs">
                <span className="text-slate-500 min-w-[150px]">{format(parseISO(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</span>
                <span className={`uppercase font-bold text-xs min-w-[60px] ${getColor(log.level)}`}>[{log.level}]</span>
                <span className="text-slate-400 min-w-[80px]">{log.source}:</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
            <div className="animate-pulse text-green-500">_</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ITIssues() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Issue Reports</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="p-4 border rounded-lg bg-red-50/10 border-red-200/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">High Memory Usage</p>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Memory usage at 87% - Consider optimization</p>
              <p className="text-xs text-muted-foreground mt-1">Reported: 2 hours ago</p>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-50/10 border-yellow-200/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">API Response Time</p>
                <Badge variant="secondary">Warning</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Average response time: 450ms - Target: &lt;300ms</p>
              <p className="text-xs text-muted-foreground mt-1">Reported: 45 minutes ago</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-50/10 border-green-200/30">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Backup Completed</p>
                <Badge variant="outline">Info</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Daily backup completed successfully - 2.3 GB</p>
              <p className="text-xs text-muted-foreground mt-1">Completed: 15 minutes ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ITOverview() {
  const { logs, appointments, users, healthMetrics } = useData();

  const recentErrors = logs.filter((l) => l.level === "error").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">System Status</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold">Operational</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Uptime</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">99.98%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Sessions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Errors Today</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-500">{recentErrors}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {logs.slice(-10).reverse().map((log) => (
              <div key={log.id} className="flex items-center justify-between p-2 border rounded bg-muted/20 text-sm">
                <div className="flex items-center gap-2">
                  {log.level === "error" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : log.level === "warning" ? <Info className="h-4 w-4 text-yellow-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className="text-xs">{format(parseISO(log.timestamp), "HH:mm:ss")}</span>
                  <span className="text-xs text-muted-foreground">{log.message}</span>
                </div>
                <Badge variant="outline" className="text-xs">{log.level}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ITHealth() {
  const { healthMetrics } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100/50 border-green-300 text-green-700";
      case "warning": return "bg-yellow-100/50 border-yellow-300 text-yellow-700";
      case "critical": return "bg-red-100/50 border-red-300 text-red-700";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Website Health Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {healthMetrics.map((metric) => (
          <Card key={metric.id} className={`border ${getStatusColor(metric.status)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{metric.metric}</p>
                <Badge variant={metric.status === "healthy" ? "outline" : "secondary"} className="text-xs">
                  {metric.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-2">{format(parseISO(metric.timestamp), "HH:mm:ss")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ITDashboard() {
  return <ITOverview />;
}
