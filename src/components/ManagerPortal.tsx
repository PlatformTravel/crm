import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Users, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Database,
  UserPlus,
  Send,
  Eye,
  TrendingUp,
  Activity
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { backendService } from "../utils/backendService";
import { useUser } from "./UserContext";

interface TeamMember {
  agentId: string;
  agentName: string;
  assigned: number;
  called: number;
  completionRate: number;
  status: 'active' | 'idle' | 'offline';
}

interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'idle' | 'offline';
  callsMade: number;
  assigned: number;
  successRate: number;
  lastActivity: string;
}

interface NumberRecord {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  company?: string;
  type: string;
}

export function ManagerPortal() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("team");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Team Performance State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamSummary, setTeamSummary] = useState({
    totalAgents: 0,
    totalAssigned: 0,
    totalCalls: 0,
    avgCompletionRate: 0
  });

  // Agent Monitoring State
  const [agents, setAgents] = useState<Agent[]>([]);

  // Number Bank State
  const [clientBank, setClientBank] = useState<NumberRecord[]>([]);
  const [customerBank, setCustomerBank] = useState<NumberRecord[]>([]);

  // Assignment Dialog State
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignType, setAssignType] = useState<"client" | "customer">("client");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assignCount, setAssignCount] = useState("");

  useEffect(() => {
    loadAllData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadAllData(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async (showToast = false) => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchTeamPerformance(showToast),
        fetchAgents(),
        fetchNumberBank()
      ]);
    } catch (error) {
      console.error("[MANAGER PORTAL] Error loading data:", error);
      toast.error("Failed to load manager data");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTeamPerformance = async (showToast = false) => {
    try {
      const response = await backendService.getTeamPerformance();
      if (response.success) {
        setTeamMembers(response.teamPerformance || []);
        setTeamSummary(response.summary || {
          totalAgents: 0,
          totalAssigned: 0,
          totalCalls: 0,
          avgCompletionRate: 0
        });
        if (showToast) {
          toast.success("Team data refreshed");
        }
      }
    } catch (error) {
      console.error("[MANAGER PORTAL] Team performance error:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await backendService.getAgentMonitoringOverview();
      if (response.success) {
        setAgents(response.agents || []);
      }
    } catch (error) {
      console.error("[MANAGER PORTAL] Agents error:", error);
    }
  };

  const fetchNumberBank = async () => {
    try {
      const [clientsData, customersData] = await Promise.all([
        backendService.getClients(),
        backendService.getCustomers()
      ]);

      if (clientsData.success) {
        setClientBank(clientsData.records || clientsData.clients || []);
      }
      if (customersData.success) {
        setCustomerBank(customersData.records || customersData.customers || []);
      }
    } catch (error) {
      console.error("[MANAGER PORTAL] Number bank error:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllData(true);
  };

  const handleAssignNumbers = async () => {
    if (!selectedAgent || !assignCount) {
      toast.error("Please select an agent and specify the number to assign");
      return;
    }

    const count = parseInt(assignCount);
    if (isNaN(count) || count <= 0) {
      toast.error("Please enter a valid number");
      return;
    }

    const bank = assignType === "client" ? clientBank : customerBank;
    if (count > bank.length) {
      toast.error(`Only ${bank.length} ${assignType}s available in the bank`);
      return;
    }

    try {
      const numbersToAssign = bank.slice(0, count).map(record => record.id);
      
      const response = assignType === "client"
        ? await backendService.assignClients({ agentId: selectedAgent, clientIds: numbersToAssign })
        : await backendService.assignCustomers({ agentId: selectedAgent, customerIds: numbersToAssign });

      if (response.success) {
        toast.success(`Assigned ${count} ${assignType}(s) to agent`);
        setShowAssignDialog(false);
        setSelectedAgent("");
        setAssignCount("");
        loadAllData();
      } else {
        toast.error(response.error || "Failed to assign numbers");
      }
    } catch (error) {
      console.error("[MANAGER PORTAL] Assignment error:", error);
      toast.error("Failed to assign numbers");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">Active</Badge>;
      case 'idle': return <Badge className="bg-yellow-500">Idle</Badge>;
      case 'offline': return <Badge variant="secondary">Offline</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-500">Loading Manager Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Manager Portal</h1>
          <p className="text-gray-500 mt-1">Team oversight and assignment management</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Agents</CardDescription>
            <CardTitle className="text-3xl">{teamSummary.totalAgents}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              Active team members
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Assigned</CardDescription>
            <CardTitle className="text-3xl">{teamSummary.totalAssigned}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-500">
              <Database className="w-4 h-4 mr-1" />
              Numbers assigned today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Calls Made</CardDescription>
            <CardTitle className="text-3xl">{teamSummary.totalCalls}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="w-4 h-4 mr-1" />
              Calls completed today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Completion</CardDescription>
            <CardTitle className="text-3xl">{teamSummary.avgCompletionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              Team performance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="assignments">Assignment Manager</TabsTrigger>
          <TabsTrigger value="monitoring">Agent Monitoring</TabsTrigger>
        </TabsList>

        {/* Team Performance Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
              <CardDescription>Real-time performance metrics for all agents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Assigned</TableHead>
                    <TableHead className="text-right">Called</TableHead>
                    <TableHead className="text-right">Completion Rate</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No agents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    teamMembers.map((member) => (
                      <TableRow key={member.agentId}>
                        <TableCell>{member.agentName}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-right">{member.assigned}</TableCell>
                        <TableCell className="text-right">{member.called}</TableCell>
                        <TableCell className="text-right">{member.completionRate}%</TableCell>
                        <TableCell className="text-right">
                          <Progress value={member.completionRate} className="w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignment Manager Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Numbers
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Numbers to Agent</DialogTitle>
                  <DialogDescription>
                    Select an agent and specify how many numbers to assign from the database
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Assignment Type</Label>
                    <Select value={assignType} onValueChange={(value: "client" | "customer") => setAssignType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Prospective Clients ({clientBank.length} available)</SelectItem>
                        <SelectItem value="customer">Existing Customers ({customerBank.length} available)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Agent</Label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an agent..." />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} - {agent.assigned} assigned
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Number to Assign</Label>
                    <Input
                      type="number"
                      value={assignCount}
                      onChange={(e) => setAssignCount(e.target.value)}
                      placeholder="Enter number of records to assign"
                      min="1"
                      max={assignType === "client" ? clientBank.length : customerBank.length}
                    />
                    <p className="text-sm text-gray-500">
                      Available: {assignType === "client" ? clientBank.length : customerBank.length} records
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignNumbers}>
                      <Send className="w-4 h-4 mr-2" />
                      Assign Numbers
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Database</CardTitle>
                <CardDescription>Prospective clients available for assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-blue-900">Total Available</p>
                        <p className="text-sm text-blue-600">Ready for assignment</p>
                      </div>
                    </div>
                    <span className="text-blue-900">{clientBank.length}</span>
                  </div>
                  {clientBank.length === 0 && (
                    <Alert>
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        No clients available in the database. Import clients from the Admin panel.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Database</CardTitle>
                <CardDescription>Existing customers available for assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-green-900">Total Available</p>
                        <p className="text-sm text-green-600">Ready for assignment</p>
                      </div>
                    </div>
                    <span className="text-green-900">{customerBank.length}</span>
                  </div>
                  {customerBank.length === 0 && (
                    <Alert>
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        No customers available in the database. Import customers from the Admin panel.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agent Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Activity Monitoring</CardTitle>
              <CardDescription>Real-time agent status and performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Assigned</TableHead>
                    <TableHead className="text-right">Calls Made</TableHead>
                    <TableHead className="text-right">Success Rate</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        No agents available
                      </TableCell>
                    </TableRow>
                  ) : (
                    agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>{agent.name}</TableCell>
                        <TableCell className="text-gray-500">{agent.email}</TableCell>
                        <TableCell>{getStatusBadge(agent.status)}</TableCell>
                        <TableCell className="text-right">{agent.assigned}</TableCell>
                        <TableCell className="text-right">{agent.callsMade}</TableCell>
                        <TableCell className="text-right">{agent.successRate}%</TableCell>
                        <TableCell className="text-gray-500 text-sm">{agent.lastActivity}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
