import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Database, Upload, Users, ArrowRight, Download, RefreshCw, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function NumberBankManager() {
  const [clientCRMBank, setClientCRMBank] = useState<any[]>([]);
  const [customerServiceBank, setCustomerServiceBank] = useState<any[]>([]);
  const [clientCRMAssignments, setClientCRMAssignments] = useState<any>({});
  const [customerServiceAssignments, setCustomerServiceAssignments] = useState<any>({});
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [importType, setImportType] = useState<"clientcrm" | "customerservice">("clientcrm");
  const [assignType, setAssignType] = useState<"clientcrm" | "customerservice">("clientcrm");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assignCount, setAssignCount] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBankData();
    fetchAssignments();
    fetchUsers();
  }, []);

  const fetchBankData = async () => {
    try {
      const [clientCRMRes, customerServiceRes] = await Promise.all([
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/number-bank/clientcrm`,
          { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
        ),
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/number-bank/customerservice`,
          { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
        )
      ]);

      const clientCRMData = await clientCRMRes.json();
      const customerServiceData = await customerServiceRes.json();

      if (clientCRMData.success) setClientCRMBank(clientCRMData.numbers);
      if (customerServiceData.success) setCustomerServiceBank(customerServiceData.numbers);
    } catch (error) {
      // Silently fail if server is offline - only show errors for other issues
      if (!(error instanceof TypeError && error.message.includes('fetch'))) {
        console.error("[NUMBER BANK] Failed to fetch bank data:", error);
        toast.error("Failed to load number bank data");
      }
    }
  };

  const fetchAssignments = async () => {
    try {
      const [clientCRMRes, customerServiceRes] = await Promise.all([
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/number-bank/assignments/clientcrm`,
          { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
        ),
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/number-bank/assignments/customerservice`,
          { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
        )
      ]);

      const clientCRMData = await clientCRMRes.json();
      const customerServiceData = await customerServiceRes.json();

      if (clientCRMData.success) setClientCRMAssignments(clientCRMData.assignments);
      if (customerServiceData.success) setCustomerServiceAssignments(customerServiceData.assignments);
    } catch (error) {
      // Silently fail if server is offline
      if (!(error instanceof TypeError && error.message.includes('fetch'))) {
        console.error("[NUMBER BANK] Failed to fetch assignments:", error);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const data = await backendService.getUsers();
      
      if (data.success) {
        // Filter out any null/undefined users
        const validUsers = (data.users || []).filter((u: any) => u != null && u.id && u.username);
        setUsers(validUsers);
        console.log('[NUMBER BANK] Loaded users:', validUsers.length);
      } else {
        console.error('[NUMBER BANK] Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      // Silently fail if server is offline
      if (!(error instanceof TypeError && error.message.includes('fetch'))) {
        console.error('[NUMBER BANK] Failed to fetch users:', error);
      }
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`[NUMBER BANK] Importing ${file.name} to ${importType} bank`);
    toast.info(`Reading CSV file: ${file.name}...`);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());

        if (lines.length < 2) {
          toast.error("CSV file is empty or invalid");
          return;
        }

        // Skip header row
        const dataLines = lines.slice(1);
        const newNumbers: any[] = [];

        dataLines.forEach((line, index) => {
          try {
            const fields = line.split(",").map(f => f.trim().replace(/^"|"$/g, ''));
            const [name, email, phone, ...rest] = fields;

            if (!name?.trim() || !phone?.trim()) return;

            const number: any = {
              id: `number_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: name.trim(),
              phone: phone.trim(),
              importedAt: new Date().toISOString()
            };

            if (email?.trim()) number.email = email.trim();

            // For ClientCRM, add additional fields if provided
            if (importType === "clientcrm" && rest.length > 0) {
              if (rest[0]) number.company = rest[0].trim();
              if (rest[1]) number.industry = rest[1].trim();
            }

            // For CustomerService, add additional fields if provided
            if (importType === "customerservice" && rest.length > 0) {
              if (rest[0]) number.business = rest[0].trim();
              if (rest[1]) number.status = rest[1].trim();
            }

            newNumbers.push(number);
          } catch (err) {
            console.error(`Error parsing line ${index + 2}:`, err);
          }
        });

        if (newNumbers.length > 0) {
          // Send to backend
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/number-bank/${importType}/add`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
              },
              body: JSON.stringify({ numbers: newNumbers })
            }
          );

          const data = await response.json();

          if (data.success) {
            toast.success(`${newNumbers.length} numbers imported to ${importType} bank!`);
            fetchBankData();
            setIsImportDialogOpen(false);
          } else {
            toast.error(data.error || "Failed to import numbers");
          }
        } else {
          toast.error("No valid numbers found in CSV file");
        }
      } catch (error) {
        console.error('[NUMBER BANK] Error importing CSV:', error);
        toast.error("Error reading CSV file");
      }
    };

    reader.onerror = () => toast.error("Failed to read the file");
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAssignNumbers = async () => {
    if (!selectedAgent || !assignCount) {
      toast.error("Please select an agent and enter a count");
      return;
    }

    const count = parseInt(assignCount);
    if (isNaN(count) || count <= 0) {
      toast.error("Please enter a valid count");
      return;
    }

    const agent = users.find(u => u.id === selectedAgent);
    if (!agent) {
      toast.error("Agent not found");
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/number-bank/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            type: assignType,
            agentId: agent.id,
            agentName: agent.name,
            count,
            assignedBy: "Admin"
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(`Assigned ${count} numbers to ${agent.name}!`);
        fetchBankData();
        fetchAssignments();
        setIsAssignDialogOpen(false);
        setSelectedAgent("");
        setAssignCount("");
      } else {
        toast.error(data.error || "Failed to assign numbers");
      }
    } catch (error) {
      console.error('[NUMBER BANK] Error assigning numbers:', error);
      toast.error("Failed to assign numbers");
    }
  };

  const handleDownloadTemplate = (type: "clientcrm" | "customerservice") => {
    const headers = type === "clientcrm"
      ? ["Name", "Email", "Phone", "Company", "Industry"]
      : ["Name", "Email", "Phone", "Business", "Status"];
    
    const exampleRow = type === "clientcrm"
      ? ["Chinedu Okafor", "chinedu@email.com", "+234 803 456 7890", "ABC Corp", "Technology"]
      : ["Bukola Adeyemi", "bukola@email.com", "+234 805 222 3333", "Corporate", "active"];
    
    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${type}-import-template.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Template downloaded successfully!");
  };

  // Safely get agent list with fallback to empty array
  const agentList = Array.isArray(users) ? users.filter(u => u && u.role === 'agent') : [];

  // Show loading state while users are being fetched
  if (isLoadingUsers) {
    return (
      <div className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-muted-foreground">Loading Number Bank Manager...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-4xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Number Bank Manager
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Import, manage, and assign phone numbers to agents
          </p>
        </div>

        <div className="flex gap-3">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                <Upload className="w-4 h-4 mr-2" />
                Import Numbers
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Numbers to Bank</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to add numbers to the number bank
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Target Bank</Label>
                  <Select value={importType} onValueChange={(v: any) => setImportType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clientcrm">ClientCRM (Prospective Clients)</SelectItem>
                      <SelectItem value="customerservice">CustomerService (Existing Customers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-900 mb-2">CSV Format</h4>
                  <p className="text-blue-800 mb-3 text-sm">
                    {importType === "clientcrm"
                      ? "Columns: Name, Email, Phone, Company, Industry"
                      : "Columns: Name, Email, Phone, Business, Status"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadTemplate(importType)}
                    className="bg-blue-100 border-blue-300 hover:bg-blue-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <Input
                    ref={fileInputRef}
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-br file:from-blue-600 file:to-cyan-600 file:text-white file:cursor-pointer hover:file:opacity-90"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg">
                <ArrowRight className="w-4 h-4 mr-2" />
                Assign to Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Numbers to Agent</DialogTitle>
                <DialogDescription>
                  Select an agent and specify how many numbers to assign
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Number Type</Label>
                  <Select value={assignType} onValueChange={(v: any) => setAssignType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clientcrm">ClientCRM Numbers ({clientCRMBank.length} available)</SelectItem>
                      <SelectItem value="customerservice">CustomerService Numbers ({customerServiceBank.length} available)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Agent</Label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentList.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} (@{agent.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Calls to Assign</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 30"
                    value={assignCount}
                    onChange={(e) => setAssignCount(e.target.value)}
                    min="1"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignNumbers} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    Assign Numbers
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => { fetchBankData(); fetchAssignments(); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Bank Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              ClientCRM Number Bank
            </CardTitle>
            <CardDescription className="text-blue-100">
              Available prospective client numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl">{clientCRMBank.length}</div>
            <p className="text-blue-100 mt-2 text-sm">numbers ready to assign</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              CustomerService Number Bank
            </CardTitle>
            <CardDescription className="text-purple-100">
              Available existing customer numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl">{customerServiceBank.length}</div>
            <p className="text-purple-100 mt-2 text-sm">numbers ready to assign</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current Agent Assignments
          </CardTitle>
          <CardDescription>
            View how numbers are currently distributed among agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentList.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No agents found. Create agents in the Admin Settings.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>ClientCRM Numbers</TableHead>
                    <TableHead>CustomerService Numbers</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentList.map(agent => {
                    const clientCRMCount = (clientCRMAssignments[agent.id] || []).length;
                    const customerServiceCount = (customerServiceAssignments[agent.id] || []).length;
                    const total = clientCRMCount + customerServiceCount;

                    return (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">@{agent.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            {clientCRMCount} numbers
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                            {customerServiceCount} numbers
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            {total} total
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
