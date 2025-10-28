// Number Bank Manager Component
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Send, 
  RefreshCw, 
  AlertCircle,
  UserPlus,
  Database,
  Package,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { backendService } from "../utils/backendService";

interface Agent {
  id: string;
  name: string;
  email: string;
  assigned: number;
}

interface NumberRecord {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  company?: string;
  type: string;
}

export function NumberBankManager() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [clientBank, setClientBank] = useState<NumberRecord[]>([]);
  const [customerBank, setCustomerBank] = useState<NumberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Assignment Dialog
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignType, setAssignType] = useState<"client" | "customer">("client");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assignCount, setAssignCount] = useState("");

  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [agentsData, clientsData, customersData] = await Promise.all([
        backendService.getAgentMonitoringOverview(),
        backendService.getClients(),
        backendService.getCustomers()
      ]);

      if (agentsData.success) {
        setAgents(agentsData.agents || []);
      }

      if (clientsData.success) {
        setClientBank(clientsData.records || clientsData.clients || []);
      }

      if (customersData.success) {
        setCustomerBank(customersData.records || customersData.customers || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
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
        loadData();
      } else {
        toast.error(response.error || "Failed to assign numbers");
      }
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Failed to assign numbers");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Number Bank Manager
          </h2>
          <p className="text-gray-600 mt-1">Assign numbers from the database to agents</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Numbers
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                      <SelectItem value="client">
                        Prospective Clients ({clientBank.length} available)
                      </SelectItem>
                      <SelectItem value="customer">
                        Existing Customers ({customerBank.length} available)
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
                          {agent.name} ({agent.assigned} assigned)
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
                  <Button onClick={handleAssignNumbers}>
                    <Send className="w-4 h-4 mr-2" />
                    Assign Numbers
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Number Bank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Client Number Bank
            </CardTitle>
            <CardDescription>Prospective clients available for assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-5xl font-bold text-blue-600 mb-2">{clientBank.length}</p>
              <p className="text-gray-600">Available Clients</p>
            </div>
            {clientBank.length === 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  No clients available in the database. Import clients from the Admin panel.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-green-600" />
              Customer Number Bank
            </CardTitle>
            <CardDescription>Existing customers available for assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-5xl font-bold text-green-600 mb-2">{customerBank.length}</p>
              <p className="text-gray-600">Available Customers</p>
            </div>
            {customerBank.length === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  No customers available in the database. Import customers from the Admin panel.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Agents</CardTitle>
          <CardDescription>Agents ready to receive number assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No agents available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.email}</p>
                    </div>
                    <Badge variant="secondary">{agent.assigned} assigned</Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => {
                      setSelectedAgent(agent.id);
                      setShowAssignDialog(true);
                    }}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
