import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellRing, 
  Calendar as CalendarIcon, 
  Clock, 
  Mail, 
  MessageSquare, 
  Send, 
  Search, 
  User,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  doctor: string;
  condition: string;
}

interface Reminder {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  type: "email" | "sms" | "both";
  subject: string;
  message: string;
  scheduledDate: Date;
  status: "pending" | "sent" | "failed";
  createdAt: Date;
  sentAt?: Date;
}

export function ReminderManagement() {
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      lastVisit: "2024-12-10",
      doctor: "Dr. Michael Chen",
      condition: "Hypertension"
    },
    {
      id: "2",
      name: "Robert Williams",
      email: "robert.williams@email.com",
      phone: "+1 (555) 987-6543",
      lastVisit: "2024-11-28",
      doctor: "Dr. Sarah Davis",
      condition: "Diabetes Type 2"
    },
    {
      id: "3",
      name: "Emily Martinez",
      email: "emily.martinez@email.com",
      phone: "+1 (555) 456-7890",
      lastVisit: "2024-12-05",
      doctor: "Dr. James Wilson",
      condition: "Asthma"
    },
    {
      id: "4",
      name: "David Thompson",
      email: "david.thompson@email.com",
      phone: "+1 (555) 234-5678",
      lastVisit: "2024-10-15",
      doctor: "Dr. Lisa Anderson",
      condition: "Arthritis"
    },
    {
      id: "5",
      name: "Jennifer Brown",
      email: "jennifer.brown@email.com",
      phone: "+1 (555) 345-6789",
      lastVisit: "2024-12-08",
      doctor: "Dr. Michael Chen",
      condition: "Migraine"
    }
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      patientId: "1",
      patientName: "Sarah Johnson",
      patientEmail: "sarah.johnson@email.com",
      type: "email",
      subject: "Follow-up Appointment Reminder",
      message: "This is a reminder for your follow-up appointment scheduled for next week. Please confirm your attendance.",
      scheduledDate: new Date("2024-12-20T10:00:00"),
      status: "sent",
      createdAt: new Date("2024-12-18T09:00:00"),
      sentAt: new Date("2024-12-18T09:15:00")
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Robert Williams",
      patientEmail: "robert.williams@email.com",
      type: "sms",
      subject: "Medication Refill Reminder",
      message: "Your medication refill is due. Please contact the pharmacy to refill your prescription.",
      scheduledDate: new Date("2024-12-19T14:00:00"),
      status: "pending",
      createdAt: new Date("2024-12-17T16:00:00")
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [reminderType, setReminderType] = useState<"email" | "sms" | "both">("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReminder = () => {
    if (!selectedPatient || !subject || !message || !scheduledDate) {
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientEmail: selectedPatient.email,
      type: reminderType,
      subject,
      message,
      scheduledDate,
      status: "pending",
      createdAt: new Date()
    };

    setReminders([...reminders, newReminder]);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Reset form
    setSelectedPatient(null);
    setSubject("");
    setMessage("");
    setScheduledDate(undefined);
    setReminderType("email");
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "both":
        return <BellRing className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Reminder sent successfully to {selectedPatient?.name}!</span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminder Management</h1>
          <p className="text-muted-foreground">
            Send appointment and medication reminders to patients
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Reminder</TabsTrigger>
          <TabsTrigger value="history">Reminder History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Select Patient
                </CardTitle>
                <CardDescription>
                  Choose the patient to send a reminder to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                        selectedPatient?.id === patient.id && "bg-accent border-primary"
                      )}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={""} />
                          <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{patient.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Last Visit: {patient.lastVisit} | Dr. {patient.doctor}</p>
                        <p>Condition: {patient.condition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reminder Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Compose Reminder
                </CardTitle>
                <CardDescription>
                  Create and schedule the reminder message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reminder-type">Reminder Type</Label>
                  <Select value={reminderType} onValueChange={(value: "email" | "sms" | "both") => setReminderType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Only
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          SMS Only
                        </div>
                      </SelectItem>
                      <SelectItem value="both">
                        <div className="flex items-center gap-2">
                          <BellRing className="w-4 h-4" />
                          Email + SMS
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter reminder subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter reminder message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Schedule Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button 
                  onClick={handleSendReminder}
                  disabled={!selectedPatient || !subject || !message || !scheduledDate}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reminder History</CardTitle>
              <CardDescription>
                View all sent and scheduled reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getTypeIcon(reminder.type)}
                        </div>
                        <div>
                          <p className="font-medium">{reminder.patientName}</p>
                          <p className="text-sm text-muted-foreground">{reminder.patientEmail}</p>
                        </div>
                      </div>
                      {getStatusBadge(reminder.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">{reminder.subject}</p>
                      <p className="text-sm text-muted-foreground">{reminder.message}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          Scheduled: {format(reminder.scheduledDate, "PPP p")}
                        </span>
                        {reminder.sentAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Sent: {format(reminder.sentAt, "PPP p")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
