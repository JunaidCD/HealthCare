import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { format, parseISO } from "date-fns";

export function ITDashboard() {
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
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xl font-bold text-slate-100">Operational</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100">99.98%</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-100">42</div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 bg-black border-slate-800 font-mono text-sm shadow-2xl overflow-hidden flex flex-col">
        <CardHeader className="bg-slate-900/50 border-b border-slate-800 py-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-sm font-normal text-slate-300">System Logs /var/log/medicare.log</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative">
            <div className="absolute inset-0 overflow-y-auto p-4 space-y-1">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors">
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
