// BTMTravel Manager Portal - Modern View with Glassmorphism
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
import { ScrollArea } from "./ui/scroll-area";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3,
  Send,
  Eye,
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Activity,
  Database,
  Filter,
  Search,
  UserPlus,
  Sparkles,
  Package,
  PhoneCall,
  Mail,
  Zap,
  TrendingDown,
  Award
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { backendService } from "../utils/backendService";
import { useUser } from "./UserContext";
import { motion } from "motion/react";

// Types
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
  source?: string;
  type: string;
}

interface Assignment {
  id: string;
  agentId: string;
  type: 'client' | 'customer';
  recordId: string;
  status: 'pending' | 'claimed' | 'called' | 'completed';
  createdAt: string;
}

export function ManagerPortalModern() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
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

  // Assignment Management State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [clientBank, setClientBank] = useState<NumberRecord[]>([]);
  const [customerBank, setCustomerBank] = useState<NumberRecord[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignType, setAssignType] = useState<"client" | "customer">("client");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assignCount, setAssignCount] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPerformance, setFilterPerformance] = useState("all");

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
      await Promise.all([
        fetchTeamPerformance(showToast),
        fetchAgents(),
        fetchNumberBank(),
        fetchAssignments()
      ]);
    } catch (error) {
      console.error("[MANAGER PORTAL MODERN] Error loading data:", error);
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
        if (showToast && response.teamPerformance?.length > 0) {
          toast.success(`Team data refreshed - ${response.teamPerformance.length} agents`);
        }
      }
    } catch (error) {
      console.error("[MANAGER PORTAL MODERN] Team performance error:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await backendService.getAgentMonitoringOverview();
      if (response.success) {
        setAgents(response.agents || []);
      }
    } catch (error) {
      console.error("[MANAGER PORTAL MODERN] Agents error:", error);
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
      console.error("[MANAGER PORTAL MODERN] Number bank error:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await backendService.getAssignments();
      if (response.success) {
        setAssignments(response.assignments || []);
      }
    } catch (error) {
      console.error("[MANAGER PORTAL MODERN] Assignments error:", error);
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
      console.error("[MANAGER PORTAL MODERN] Assignment error:", error);
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

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (rate >= 60) return <Badge className="bg-blue-500">Good</Badge>;
    if (rate >= 40) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  // Filter team members
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    const matchesPerformance = 
      filterPerformance === "all" ||
      (filterPerformance === "high" && member.completionRate >= 80) ||
      (filterPerformance === "medium" && member.completionRate >= 40 && member.completionRate < 80) ||
      (filterPerformance === "low" && member.completionRate < 40);
    
    return matchesSearch && matchesStatus && matchesPerformance;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600">Loading Manager Portal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Header with Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-purple-600/5 to-blue-600/5" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 flex items-center gap-2">
                Manager Dashboard
                <Sparkles className="w-6 h-6 text-purple-500" />
              </h1>
              <p className="text-gray-600 mt-1">Real-time team oversight and performance analytics</p>
            </div>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </motion.div>

      {/* Modern Summary Cards with Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-violet-600">
                <Users className="w-4 h-4" />
                Total Agents
              </CardDescription>
              <CardTitle className="text-4xl text-violet-700">{teamSummary.totalAgents}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-violet-600">
                <Activity className="w-4 h-4 mr-1" />
                Active team members
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-blue-600">
                <Database className="w-4 h-4" />
                Total Assigned
              </CardDescription>
              <CardTitle className="text-4xl text-blue-700">{teamSummary.totalAssigned}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-600">
                <Package className="w-4 h-4 mr-1" />
                Numbers assigned today
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="relative overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-green-600">
                <Phone className="w-4 h-4" />
                Total Calls
              </CardDescription>
              <CardTitle className="text-4xl text-green-700">{teamSummary.totalCalls}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <PhoneCall className="w-4 h-4 mr-1" />
                Calls completed today
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="relative overflow-hidden border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-orange-600">
                <Award className="w-4 h-4" />
                Avg Completion
              </CardDescription>
              <CardTitle className="text-4xl text-orange-700">{teamSummary.avgCompletionRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-orange-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                Team performance
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Tabs with Modern Design */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-violet-100 to-purple-100 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <BarChart3 className="w-4 h-4 mr-2" />
            Team Overview
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Send className="w-4 h-4 mr-2" />
            Assignment Manager
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-white data-[state=active]:shadow-lg">
            <Eye className="w-4 h-4 mr-2" />
            Agent Monitoring
          </TabsTrigger>
        </TabsList>

        {/* Team Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="border-violet-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-violet-600" />
                    Team Performance Overview
                  </CardTitle>
                  <CardDescription>Real-time performance metrics for all agents</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="idle">Idle</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPerformance} onValueChange={setFilterPerformance}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Performance</SelectItem>
                      <SelectItem value="high">High (80%+)</SelectItem>
                      <SelectItem value="medium">Medium (40-80%)</SelectItem>
                      <SelectItem value="low">Low (&lt; 40%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Assigned</TableHead>
                      <TableHead className="text-right">Called</TableHead>
                      <TableHead className="text-right">Completion Rate</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeamMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-12">
                          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No agents found</p>
                          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeamMembers.map((member, index) => (
                        <motion.tr
                          key={member.agentId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-violet-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                              {member.agentName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className={
                              member.status === 'active' ? 'bg-green-500' :
                              member.status === 'idle' ? 'bg-yellow-500' : ''
                            }>
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{member.assigned}</TableCell>
                          <TableCell className="text-right">{member.called}</TableCell>
                          <TableCell className="text-right">{member.completionRate}%</TableCell>
                          <TableCell className="text-right">{getPerformanceBadge(member.completionRate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Progress value={member.completionRate} className="w-24" />
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignment Manager Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Numbers to Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-violet-600" />
                    Assign Numbers to Agent
                  </DialogTitle>
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
                        <SelectItem value="client">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-500" />
                            Prospective Clients ({clientBank.length} available)
                          </div>
                        </SelectItem>
                        <SelectItem value="customer">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-green-500" />
                            Existing Customers ({customerBank.length} available)
                          </div>
                        </SelectItem>
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
                            <div className="flex items-center justify-between gap-4">
                              <span>{agent.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {agent.assigned} assigned
                              </Badge>
                            </div>
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

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignNumbers} className="bg-gradient-to-r from-violet-500 to-purple-600">
                      <Send className="w-4 h-4 mr-2" />
                      Assign Numbers
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    Client Database
                  </CardTitle>
                  <CardDescription>Prospective clients available for assignment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="relative">
                        <p className="text-blue-100 text-sm mb-2">Total Available</p>
                        <p className="text-5xl font-bold mb-2">{clientBank.length}</p>
                        <p className="text-blue-100 text-sm">Ready for assignment</p>
                      </div>
                    </div>
                    {clientBank.length === 0 && (
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <AlertDescription className="text-blue-700">
                          No clients available in the database. Import clients from the Admin panel.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-600" />
                    Customer Database
                  </CardTitle>
                  <CardDescription>Existing customers available for assignment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="relative">
                        <p className="text-green-100 text-sm mb-2">Total Available</p>
                        <p className="text-5xl font-bold mb-2">{customerBank.length}</p>
                        <p className="text-green-100 text-sm">Ready for assignment</p>
                      </div>
                    </div>
                    {customerBank.length === 0 && (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          No customers available in the database. Import customers from the Admin panel.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Agent Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Agent Activity Monitoring
              </CardTitle>
              <CardDescription>Real-time agent status and performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
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
                        <TableCell colSpan={7} className="text-center text-gray-500 py-12">
                          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No agents available</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      agents.map((agent, index) => (
                        <motion.tr
                          key={agent.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-purple-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                              {agent.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500">{agent.email}</TableCell>
                          <TableCell>
                            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className={
                              agent.status === 'active' ? 'bg-green-500' :
                              agent.status === 'idle' ? 'bg-yellow-500' : ''
                            }>
                              {agent.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{agent.assigned}</TableCell>
                          <TableCell className="text-right">{agent.callsMade}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span>{agent.successRate}%</span>
                              {agent.successRate >= 80 && <TrendingUp className="w-4 h-4 text-green-500" />}
                              {agent.successRate < 40 && <TrendingDown className="w-4 h-4 text-red-500" />}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">{agent.lastActivity}</TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
