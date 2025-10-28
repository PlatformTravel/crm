// Database Manager Component
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  Database, 
  RefreshCw, 
  Upload,
  Download,
  Trash2,
  AlertCircle,
  FileText,
  Users,
  UserCheck
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { backendService } from "../utils/backendService";

interface DatabaseStats {
  totalClients: number;
  totalCustomers: number;
  assignedClients: number;
  assignedCustomers: number;
  availableClients: number;
  availableCustomers: number;
}

export function DatabaseManager() {
  const [stats, setStats] = useState<DatabaseStats>({
    totalClients: 0,
    totalCustomers: 0,
    assignedClients: 0,
    assignedCustomers: 0,
    availableClients: 0,
    availableCustomers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isImportClientsOpen, setIsImportClientsOpen] = useState(false);
  const [isImportCustomersOpen, setIsImportCustomersOpen] = useState(false);
  const clientFileInputRef = useRef<HTMLInputElement>(null);
  const customerFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDatabaseStats();
    
    const interval = setInterval(loadDatabaseStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDatabaseStats = async () => {
    try {
      const [clientsData, customersData, assignmentsData] = await Promise.all([
        backendService.getClients(),
        backendService.getCustomers(),
        backendService.getAssignments()
      ]);

      const totalClients = clientsData.success ? (clientsData.records?.length || clientsData.clients?.length || 0) : 0;
      const totalCustomers = customersData.success ? (customersData.records?.length || customersData.customers?.length || 0) : 0;
      
      const assignments = assignmentsData.success ? (assignmentsData.assignments || []) : [];
      const assignedClients = assignments.filter((a: any) => a.type === 'client').length;
      const assignedCustomers = assignments.filter((a: any) => a.type === 'customer').length;

      setStats({
        totalClients,
        totalCustomers,
        assignedClients,
        assignedCustomers,
        availableClients: totalClients - assignedClients,
        availableCustomers: totalCustomers - assignedCustomers
      });
    } catch (error) {
      console.error("Failed to load database stats:", error);
      toast.error("Failed to load database statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportClients = () => {
    setIsImportClientsOpen(true);
  };

  const handleImportCustomers = () => {
    setIsImportCustomersOpen(true);
  };

  const handleClientFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
      
      // Skip header row
      const dataRows = rows.slice(1).filter(row => row.length >= 3 && row[0]);
      
      let successCount = 0;
      let errorCount = 0;

      // Batch import all clients
      const clients = [];
      
      for (const row of dataRows) {
        try {
          const [name, phone, company, status, lastContact, notes, email] = row;
          
          clients.push({
            name,
            phone,
            email: email || "",
            company,
            notes: notes || "",
            status: status || 'pending',
            lastContact
          });
        } catch (error) {
          errorCount++;
        }
      }

      // Import all clients in one call
      try {
        const data = await backendService.importClients(clients);
        if (data.success) {
          successCount = clients.length;
        } else {
          errorCount = clients.length;
        }
      } catch (error) {
        errorCount = clients.length;
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} client${successCount > 1 ? 's' : ''}!`);
        await loadDatabaseStats(); // Refresh stats
      }
      if (errorCount > 0) {
        toast.warning(`${errorCount} client${errorCount > 1 ? 's' : ''} could not be imported.`);
      }
      
      setIsImportClientsOpen(false);
      if (clientFileInputRef.current) {
        clientFileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleCustomerFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
      
      // Skip header row
      const dataRows = rows.slice(1).filter(row => row.length >= 3 && row[0]);
      
      let successCount = 0;
      let errorCount = 0;

      // Batch import all customers
      const customers = [];
      
      for (const row of dataRows) {
        try {
          const [name, email, phone, business, status, lastContact, totalPurchases, totalRevenue, notes] = row;
          
          // Validate business type
          const validBusinessTypes = ["Online Sales", "Corporate", "Channel", "Retails", "Protocol", "Others"];
          const customerBusiness = validBusinessTypes.includes(business) ? business : "Others";
          
          // Validate status
          const validStatuses = ["active", "inactive", "vip", "corporate"];
          const customerStatus = validStatuses.includes(status) ? status : "active";
          
          customers.push({
            name,
            email,
            phone,
            business: customerBusiness,
            status: customerStatus,
            notes: notes || "",
            lastContact,
            totalPurchases: parseInt(totalPurchases) || 0
          });
        } catch (error) {
          errorCount++;
        }
      }

      // Import all customers in one call
      try {
        const data = await backendService.importCustomers(customers);
        if (data.success) {
          successCount = customers.length;
        } else {
          errorCount = customers.length;
        }
      } catch (error) {
        errorCount = customers.length;
        console.error('[IMPORT] Error importing customers:', error);
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} customer${successCount > 1 ? 's' : ''}!`);
        await loadDatabaseStats(); // Refresh stats
      }
      if (errorCount > 0) {
        toast.warning(`${errorCount} customer${errorCount > 1 ? 's' : ''} could not be imported.`);
      }
      
      setIsImportCustomersOpen(false);
      if (customerFileInputRef.current) {
        customerFileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleDownloadClientTemplate = () => {
    const template = [
      ['Name', 'Phone', 'Company', 'Status', 'Last Contact', 'Notes', 'Email'],
      ['John Doe', '+234 803 123 4567', 'Acme Corp', 'pending', 'Oct 16, 2025', 'Follow up next week', 'john@acme.com'],
      ['Jane Smith', '+234 805 234 5678', 'Tech Solutions', 'completed', 'Oct 15, 2025', 'Deal closed', 'jane@techsolutions.com']
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'btm-clients-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Template downloaded successfully!");
  };

  const handleDownloadCustomerTemplate = () => {
    const template = [
      ['Name', 'Email', 'Phone', 'Business', 'Status', 'Last Contact', 'Total Purchases', 'Total Revenue', 'Notes'],
      ['Adewale Ogunleye', 'adewale@email.com', '+234 803 111 2222', 'Corporate', 'vip', 'Oct 15, 2025', '10', '5000', 'VIP customer'],
      ['Chidinma Nwosu', 'chidinma@email.com', '+234 805 222 3333', 'Online Sales', 'active', 'Oct 14, 2025', '5', '2500', 'Regular customer']
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'btm-customers-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Template downloaded successfully!");
  };

  const handleExportClients = async () => {
    try {
      const data = await backendService.getClients();

      if (data.success) {
        const clients = data.records || data.clients || [];
        
        const csvContent = [
          ['Name', 'Phone', 'Company', 'Status', 'Last Contact', 'Notes', 'Email'],
          ...clients.map((c: any) => [
            c.name,
            c.phone,
            c.company,
            c.status,
            c.lastContact || '',
            c.notes || '',
            c.email || ''
          ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `btm-clients-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("Client list exported successfully!");
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Failed to export clients:', error);
      toast.error('Failed to export clients. Please check your connection.');
    }
  };

  const handleMigrateCustomers = async () => {
    try {
      toast.loading("Migrating customer records...");
      const data = await backendService.migrateCustomers();
      
      if (data.success) {
        toast.success(data.message || "Customer records migrated successfully!");
        await loadDatabaseStats(); // Refresh stats
      } else {
        throw new Error('Migration failed');
      }
    } catch (error) {
      console.error('Failed to migrate customers:', error);
      toast.error('Failed to migrate customer records. Please try again.');
    }
  };

  const handleExportCustomers = async () => {
    try {
      const data = await backendService.getCustomers();

      if (data.success) {
        const customers = data.customers || data.records || [];
        
        const csvContent = [
          ['Name', 'Email', 'Phone', 'Business', 'Status', 'Last Contact', 'Total Purchases', 'Total Revenue', 'Notes'],
          ...customers.map((c: any) => [
            c.name,
            c.email,
            c.phone,
            c.business,
            c.status,
            c.lastContact || '',
            c.totalPurchases || '0',
            c.totalRevenue || '0',
            c.notes || ''
          ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `btm-customers-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("Customer list exported successfully!");
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Failed to export customers:', error);
      toast.error('Failed to export customers. Please check your connection.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Database Management
          </h2>
          <p className="text-gray-600 mt-1">Manage clients and customers database</p>
        </div>
        <Button onClick={loadDatabaseStats} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Database Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Prospective Clients Database
            </CardTitle>
            <CardDescription>Client records and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalClients}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.availableClients}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.assignedClients}</p>
                <p className="text-sm text-gray-600">Assigned</p>
              </div>
            </div>

            {stats.availableClients === 0 && stats.totalClients > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  All clients have been assigned. Import more clients to continue operations.
                </AlertDescription>
              </Alert>
            )}

            {stats.totalClients === 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  No clients in database. Upload CSV file to import clients.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleImportClients} className="flex-1" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Clients
              </Button>
              <Button onClick={handleExportClients} variant="outline" disabled={stats.totalClients === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              Existing Customers Database
            </CardTitle>
            <CardDescription>Customer records and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.totalCustomers}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.availableCustomers}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.assignedCustomers}</p>
                <p className="text-sm text-gray-600">Assigned</p>
              </div>
            </div>

            {stats.availableCustomers === 0 && stats.totalCustomers > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  All customers have been assigned. Import more customers to continue operations.
                </AlertDescription>
              </Alert>
            )}

            {stats.totalCustomers === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  No customers in database. Upload CSV file to import customers.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleImportCustomers} className="flex-1" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Customers
              </Button>
              <Button onClick={handleExportCustomers} variant="outline" disabled={stats.totalCustomers === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            {stats.totalCustomers > 0 && stats.availableCustomers === 0 && (
              <Button onClick={handleMigrateCustomers} variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Fix Customer Records (Migration)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Database Overview</CardTitle>
          <CardDescription>Complete database statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Database className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{stats.totalClients + stats.totalCustomers}</p>
              <p className="text-sm text-gray-600">Total Records</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{stats.availableClients + stats.availableCustomers}</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{stats.assignedClients + stats.assignedCustomers}</p>
              <p className="text-sm text-gray-600">Assigned</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <UserCheck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalClients + stats.totalCustomers > 0 
                  ? Math.round(((stats.assignedClients + stats.assignedCustomers) / (stats.totalClients + stats.totalCustomers)) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">Utilization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Clients Dialog */}
      <Dialog open={isImportClientsOpen} onOpenChange={setIsImportClientsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Import Clients from CSV
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file to import prospective client records into the database
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>CSV Format:</strong> Name, Phone, Company, Status, Last Contact, Notes, Email
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button 
                onClick={handleDownloadClientTemplate}
                variant="outline" 
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template CSV
              </Button>

              <input
                ref={clientFileInputRef}
                type="file"
                accept=".csv"
                onChange={handleClientFileImport}
                className="hidden"
              />
              
              <Button 
                onClick={() => clientFileInputRef.current?.click()}
                className="w-full bg-gradient-to-br from-blue-600 to-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select CSV File to Import
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportClientsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Customers Dialog */}
      <Dialog open={isImportCustomersOpen} onOpenChange={setIsImportCustomersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              Import Customers from CSV
            </DialogTitle>
            <DialogDescription>
              Upload a CSV file to import existing customer records into the database
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>CSV Format:</strong> Name, Email, Phone, Business, Status, Last Contact, Total Purchases, Total Revenue, Notes
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button 
                onClick={handleDownloadCustomerTemplate}
                variant="outline" 
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template CSV
              </Button>

              <input
                ref={customerFileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCustomerFileImport}
                className="hidden"
              />
              
              <Button 
                onClick={() => customerFileInputRef.current?.click()}
                className="w-full bg-gradient-to-br from-green-600 to-green-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select CSV File to Import
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportCustomersOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
