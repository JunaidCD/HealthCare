import { Switch, Route } from "wouter";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

function ITLogs() {
  const { logs } = useData();
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const now = Date.now();
  const isTemporarilyLocked = lockedUntil !== null && now < lockedUntil;

  const visibleLogs = useMemo(() => {
    if (isUnlocked) return logs;
    return logs.slice(-30);
  }, [isUnlocked, logs]);

  const maskMessage = (message: string, level: string) => {
    const trimmed = message.trim();
    const short = trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed;
    if (isUnlocked) return trimmed;
    if (level === "error") return "REDACTED (unlock to view full error details)";
    return short;
  };

  const handleUnlock = () => {
    if (isTemporarilyLocked) {
      toast({
        title: "Temporarily locked",
        description: "Too many incorrect attempts. Please wait and try again.",
        variant: "destructive",
      });
      return;
    }

    if (password === "123") {
      setIsUnlocked(true);
      setPassword("");
      setError("");
      setAttempts(0);
      setLockedUntil(null);
      toast({ title: "Unlocked", description: "Full logs access granted for this page session." });
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setError("Incorrect password. Please try again.");
    if (nextAttempts >= 3) {
      setLockedUntil(Date.now() + 30_000);
      setAttempts(0);
      setPassword("");
      toast({
        title: "Too many attempts",
        description: "Locked for 30 seconds.",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-normal text-slate-300">System Logs /var/log/medicare.log</span>
              {!isUnlocked && <Badge variant="secondary" className="text-xs">Restricted</Badge>}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-xs">
                  {isUnlocked ? "Unlocked" : "Unlock Full Logs"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Unlock Full Logs</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enter password to view full log history and error details.
                  </p>
                  <Input
                    type="password"
                    placeholder={isTemporarilyLocked ? "Locked temporarily" : "Password"}
                    value={password}
                    disabled={isUnlocked || isTemporarilyLocked}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUnlock();
                    }}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {isTemporarilyLocked && (
                    <p className="text-sm text-muted-foreground">
                      Try again in {Math.ceil(((lockedUntil ?? 0) - Date.now()) / 1000)}s.
                    </p>
                  )}
                  <Button
                    className="w-full"
                    onClick={handleUnlock}
                    disabled={isUnlocked || isTemporarilyLocked || !password.trim()}
                  >
                    Unlock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative">
          <div className="absolute inset-0 overflow-y-auto p-4 space-y-1">
            {visibleLogs.map((log) => (
              <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors text-xs">
                <span className="text-slate-500 min-w-[150px]">{format(parseISO(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</span>
                <span className={`uppercase font-bold text-xs min-w-[60px] ${getColor(log.level)}`}>[{log.level}]</span>
                <span className="text-slate-400 min-w-[80px]">{log.source}:</span>
                <span className="text-slate-300">{maskMessage(log.message, log.level)}</span>
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
  const { toast } = useToast();
  const [resolved, setResolved] = useState<Record<string, boolean>>({});
  const [criticalPassword, setCriticalPassword] = useState("");
  const [criticalError, setCriticalError] = useState("");

  const issues = [
    {
      id: "mem",
      title: "High Memory Usage",
      severity: "Critical" as const,
      description: "Memory usage at 87% - Consider optimization",
      reported: "2 hours ago",
    },
    {
      id: "api",
      title: "API Response Time",
      severity: "Warning" as const,
      description: "Average response time: 450ms - Target: <300ms",
      reported: "45 minutes ago",
    },
    {
      id: "backup",
      title: "Backup Completed",
      severity: "Info" as const,
      description: "Daily backup completed successfully - 2.3 GB",
      reported: "15 minutes ago",
    },
  ];

  const markResolved = (id: string) => {
    setResolved((prev) => ({ ...prev, [id]: true }));
    toast({ title: "Issue resolved", description: "Marked as resolved." });
  };

  const tryResolveCritical = (id: string) => {
    if (criticalPassword === "123") {
      setCriticalPassword("");
      setCriticalError("");
      markResolved(id);
      return;
    }
    setCriticalError("Incorrect password. Please try again.");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Issue Reports</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {issues.filter((i) => !resolved[i.id]).map((issue) => (
              <div
                key={issue.id}
                className={
                  issue.severity === "Critical"
                    ? "p-4 border rounded-lg bg-red-50/10 border-red-200/30"
                    : issue.severity === "Warning"
                      ? "p-4 border rounded-lg bg-yellow-50/10 border-yellow-200/30"
                      : "p-4 border rounded-lg bg-green-50/10 border-green-200/30"
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{issue.title}</p>
                  {issue.severity === "Critical" ? (
                    <Badge variant="destructive">Critical</Badge>
                  ) : issue.severity === "Warning" ? (
                    <Badge variant="secondary">Warning</Badge>
                  ) : (
                    <Badge variant="outline">Info</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{issue.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Reported: {issue.reported}</p>
                <div className="mt-3 flex items-center justify-end">
                  {issue.severity === "Critical" ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="destructive">Resolve (Restricted)</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Resolve Critical Issue</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Password required to resolve critical issues.
                          </p>
                          <Input
                            type="password"
                            placeholder="Password"
                            value={criticalPassword}
                            onChange={(e) => {
                              setCriticalPassword(e.target.value);
                              if (criticalError) setCriticalError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") tryResolveCritical(issue.id);
                            }}
                          />
                          {criticalError && <p className="text-sm text-red-500">{criticalError}</p>}
                          <Button className="w-full" onClick={() => tryResolveCritical(issue.id)} disabled={!criticalPassword.trim()}>
                            Confirm Resolve
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (window.confirm("Mark this issue as resolved?")) markResolved(issue.id);
                      }}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {issues.filter((i) => !resolved[i.id]).length === 0 && (
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">No open issues. All clear.</p>
              </div>
            )}
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
