import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { Database, Upload, Users, UserPlus, Trash2, Download, ArrowRight, Check, X, FileDown, FileUp, Eye, Archive, Clock, Filter, XCircle, Plane } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  source?: string;
  customerType?: 'Retails' | 'Corporate' | 'Channel';
  flightInfo?: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  bookingReference?: string;
  destination?: string;
  travelDate?: string;
  packageType?: string;
  notes?: string;
  customerType?: 'Retails' | 'Corporate' | 'Channel';
  flightInfo?: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export function DatabaseManager() {
  const [clients, setClients] = useState<Contact[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [assignCount, setAssignCount] = useState('');
  const [importText, setImportText] = useState('');
  const [importType, setImportType] = useState<'clients' | 'customers'>('clients');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // Filter states
  const [filterCustomerType, setFilterCustomerType] = useState<string[]>([]);
  const [filterFlightInfo, setFilterFlightInfo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load database
  useEffect(() => {
    loadDatabase();
    loadUsers();
  }, []);

  // Helper function to apply filters
  const applyFilters = (records: any[]) => {
    return records.filter(record => {
      // Filter by customer type
      if (filterCustomerType.length > 0) {
        if (!record.customerType || !filterCustomerType.includes(record.customerType)) {
          return false;
        }
      }
      
      // Filter by flight info
      if (filterFlightInfo.trim()) {
        if (!record.flightInfo || !record.flightInfo.toLowerCase().includes(filterFlightInfo.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Get filtered data
  const filteredClients = applyFilters(clients);
  const filteredCustomers = applyFilters(customers);

  // Check if filters are active
  const hasActiveFilters = filterCustomerType.length > 0 || filterFlightInfo.trim() !== '';

  // Clear all filters
  const clearFilters = () => {
    setFilterCustomerType([]);
    setFilterFlightInfo('');
  };

  // Toggle customer type filter
  const toggleCustomerTypeFilter = (type: string) => {
    setFilterCustomerType(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Clear all ClientCRM data
  const handleClearAllClients = async () => {
    const confirmation = prompt('⚠️ CLEAR ALL CLIENTCRM DATA?\n\nThis will permanently delete:\n• All ' + clients.length + ' clients in the database\n• All archived clients  \n• All assigned clients for all agents\n\nType "CLEAR" to confirm:');
    
    if (confirmation !== 'CLEAR') {
      if (confirmation !== null) {
        toast.error('Confirmation text did not match. Operation cancelled.');
      }
      return;
    }

    try {
      console.log('[DATABASE] 🗑️ Clearing all ClientCRM data...');
      toast.info('Clearing ClientCRM data...');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/clients/clear-all`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('[DATABASE] ✅ ClientCRM data cleared:', data);
        console.log('[DATABASE] Cleared counts:', data.cleared);
        toast.success(`✅ ClientCRM cleared! (${data.cleared?.assignedClientsCount || 0} assigned records deleted)`);
        
        // Reload database
        await loadDatabase();
      } else {
        const errorData = await response.json();
        console.error('[DATABASE] ❌ Failed to clear ClientCRM data:', errorData);
        toast.error(`Failed to clear data: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[DATABASE] ❌ Error clearing ClientCRM data:', error);
      toast.error('Error clearing ClientCRM data');
    }
  };

  // Complete database reset
  const handleCompleteReset = async () => {
    const confirmation = prompt('🚨 RESET ENTIRE DATABASE?\\n\\nThis will permanently delete:\\n• All clients (' + clients.length + ')\\n• All customers (' + customers.length + ')\\n• All call scripts\\n• All promotions\\n• All archives\\n• All assignments\\n\\nType "RESET DATABASE" to confirm:');
    
    if (confirmation !== 'RESET DATABASE') {
      if (confirmation !== null) {
        toast.error('Confirmation text did not match. Operation cancelled.');
      }
      return;
    }

    const finalConfirm = window.confirm('⚠️ FINAL WARNING\\n\\nThis will COMPLETELY WIPE THE DATABASE.\\n\\nClick OK to proceed with FULL RESET.');
    
    if (!finalConfirm) {
      return;
    }

    try {
      console.log('[DATABASE] 🗑️ Resetting entire database...');
      toast.info('Resetting database...', { duration: 3000 });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/reset-all`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('[DATABASE] ✅ Database reset complete:', data);
        toast.success('✅ Database completely reset!', { duration: 5000 });
        
        // Reload database
        await loadDatabase();
      } else {
        const errorData = await response.json();
        console.error('[DATABASE] ❌ Failed to reset database:', errorData);
        toast.error(`Failed to reset: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[DATABASE] ❌ Error resetting database:', error);
      toast.error('Error resetting database');
    }
  };

  const loadDatabase = async () => {
    try {
      setLoading(true);
      
      // Load clients database
      const clientsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/clients`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const clientsData = await clientsRes.json();
      
      // Load customers database
      const customersRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/customers`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const customersData = await customersRes.json();
      
      if (clientsData.success) {
        setClients(clientsData.records || []);
      }
      
      if (customersData.success) {
        setCustomers(customersData.records || []);
      }
    } catch (error) {
      console.error('Error loading database:', error);
      toast.error('Failed to load database');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await backendService.getUsers();
      console.log('[DATABASE MANAGER] ========== USER LOADING DEBUG ==========');
      console.log('[DATABASE MANAGER] Full response:', data);
      console.log('[DATABASE MANAGER] All users from backend:', data.users);
      console.log('[DATABASE MANAGER] Number of users:', data.users?.length || 0);
      
      if (data.users) {
        // Log each user's details
        data.users.forEach((u: User, index: number) => {
          console.log(`[DATABASE MANAGER] User ${index + 1}:`, {
            id: u.id,
            name: u.name,
            role: u.role,
            roleType: typeof u.role,
            roleUpperCase: u.role?.toUpperCase?.()
          });
        });
        
        // Filter agents (case-insensitive)
        const agents = data.users.filter((u: User) => 
          u.role && u.role.toLowerCase() === 'agent'
        );
        console.log('[DATABASE MANAGER] Filtered agents:', agents);
        console.log('[DATABASE MANAGER] Number of agents:', agents.length);
        console.log('[DATABASE MANAGER] ========================================');
        setUsers(agents);
      } else {
        console.log('[DATABASE MANAGER] No users field in response');
      }
    } catch (error) {
      console.error('[DATABASE MANAGER] Error loading users:', error);
    }
  };

  const downloadSampleFile = (type: 'clients' | 'customers') => {
    let csvContent = '';
    
    if (type === 'clients') {
      csvContent = 'name,email,phone,company,source,customerType,flightInfo,notes\n';
      csvContent += 'John Doe,john.doe@example.com,+234 801 234 5678,Tech Solutions Ltd,Website,Corporate,Emirates EK-785,Interested in Dubai packages\n';
      csvContent += 'Jane Smith,jane.smith@example.com,+234 802 345 6789,Global Trading Co,Referral,Channel,Turkish Airlines TK-624,Looking for group bookings\n';
      csvContent += 'Ahmed Ibrahim,ahmed.ibrahim@example.com,+234 803 456 7890,ABC Corporation,Social Media,Retails,Qatar Airways QR-581,Interested in Hajj packages\n';
    } else {
      csvContent = 'name,email,phone,company,bookingReference,destination,travelDate,packageType,customerType,flightInfo,notes\n';
      csvContent += 'Sarah Johnson,sarah.j@example.com,+234 804 567 8901,Global Tech Solutions,BTM2024001,Dubai,2024-12-15,Luxury Package,Corporate,Emirates EK-785,VIP customer\n';
      csvContent += 'Michael Chen,michael.c@example.com,+234 805 678 9012,Individual,BTM2024002,Makkah,2024-11-20,Hajj Premium,Retails,Saudia SV-308,Requires wheelchair access\n';
      csvContent += 'Fatima Ali,fatima.a@example.com,+234 806 789 0123,Travel Partners Ltd,BTM2024003,Istanbul,2025-01-10,Standard Package,Channel,Turkish Airlines TK-624,Family of 4\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `sample_${type}_import.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Sample ${type} file downloaded`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setImportText(text);
      parseAndPreview(text);
    };
    reader.readAsText(file);
  };

  const parseAndPreview = (text: string) => {
    if (!text.trim()) {
      toast.error('File is empty');
      return;
    }

    try {
      // Parse CSV or tab-separated data
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        toast.error('File must contain headers and at least one data row');
        return;
      }

      const headers = lines[0].split(/[,\t]/).map(h => h.trim());
      
      const records = lines.slice(1).map((line, idx) => {
        const values = line.split(/[,\t]/);
        const record: any = {
          id: `${importType}_${Date.now()}_${idx}`,
          createdAt: new Date().toISOString(),
        };
        
        headers.forEach((header, i) => {
          const key = header.toLowerCase().replace(/\s+/g, '');
          const value = values[i]?.trim() || '';
          
          // Map common variations to standard field names
          if (key === 'customertype') {
            record.customerType = value;
          } else if (key === 'flightinfo' || key === 'flight') {
            record.flightInfo = value;
          } else {
            record[header.toLowerCase()] = value;
          }
        });
        
        return record;
      });

      setPreviewData(records);
      setShowPreview(true);
      toast.success(`Preview ready: ${records.length} records found`);
    } catch (error) {
      console.error('Parse error:', error);
      toast.error('Failed to parse file. Please check format.');
    }
  };

  const handlePreviewFromText = () => {
    if (!importText.trim()) {
      toast.error('Please enter data to preview');
      return;
    }
    parseAndPreview(importText);
  };

  const handleConfirmImport = async () => {
    if (previewData.length === 0) {
      toast.error('No data to import');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/${importType}/import`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ records: previewData }),
        }
      );

      const data = await res.json();
      
      if (data.success) {
        toast.success(`${data.count} records imported successfully`);
        setImportText('');
        setPreviewData([]);
        setShowPreview(false);
        setImportDialogOpen(false);
        loadDatabase();
      } else {
        toast.error(data.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setLoading(false);
    }
  };

  const resetImport = () => {
    setImportText('');
    setPreviewData([]);
    setShowPreview(false);
  };

  const handleAssign = async (type: 'clients' | 'customers') => {
    if (!selectedAgent || !assignCount) {
      toast.error('Please select an agent and enter count');
      return;
    }

    const count = parseInt(assignCount);
    if (isNaN(count) || count < 1) {
      toast.error('Please enter a valid count');
      return;
    }

    const selectedUser = users.find(u => u.id === selectedAgent);
    if (!selectedUser) {
      toast.error('Agent not found');
      return;
    }

    // Check if filtered count is enough
    const availableRecords = type === 'clients' ? filteredClients : filteredCustomers;
    if (hasActiveFilters && availableRecords.length < count) {
      toast.error(`Not enough filtered records. Available: ${availableRecords.length}, Requested: ${count}`);
      return;
    }

    try {
      setLoading(true);
      
      // Build filter object
      const filters: any = {};
      if (filterCustomerType.length > 0) {
        filters.customerType = filterCustomerType;
      }
      if (filterFlightInfo.trim()) {
        filters.flightInfo = filterFlightInfo.trim();
      }

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/${type}/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            agentId: selectedAgent,
            agentName: selectedUser.name,
            count,
            filters: hasActiveFilters ? filters : undefined,
          }),
        }
      );

      const data = await res.json();
      
      if (data.success) {
        const filterMsg = hasActiveFilters ? ' (filtered)' : '';
        toast.success(`Assigned ${data.assignedCount} ${type}${filterMsg} to ${selectedUser.name}`);
        setSelectedAgent('');
        setAssignCount('');
        clearFilters();
        loadDatabase();
      } else {
        toast.error(data.error || 'Assignment failed');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error('Failed to assign records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'clients' | 'customers', id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/${type}/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      const data = await res.json();
      
      if (data.success) {
        toast.success('Record deleted');
        loadDatabase();
      } else {
        toast.error(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete record');
    }
  };

  const handleDailyArchive = async () => {
    if (!confirm('This will archive all completed calls from all agents. Continue?')) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/cron/daily-archive`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );

      const data = await res.json();
      
      if (data.success) {
        toast.success(`${data.message} - Clients: ${data.results.clients.count}, Customers: ${data.results.customers.count}`, {
          duration: 5000
        });
        loadDatabase();
      } else {
        toast.error(data.error || 'Archive failed');
      }
    } catch (error) {
      console.error('Daily archive error:', error);
      toast.error('Failed to run daily archive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Clients & Customers Database
              </h1>
              <p className="text-gray-600">Central database for all contacts and customers</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={async () => {
                console.log('🎯 Clear All button clicked!');
                
                const firstConfirm = window.confirm(
                  '⚠️ CLEAR ALL CLIENTCRM DATA?\n\n' +
                  'This will permanently delete:\n' +
                  '• All ' + clients.length + ' clients in the database\n' +
                  '• All archived clients\n' +
                  '• All assigned clients for all agents\n\n' +
                  'Are you absolutely sure?'
                );
                
                if (!firstConfirm) {
                  console.log('User cancelled first confirmation');
                  return;
                }
                
                const secondConfirm = window.confirm(
                  '⚠️ FINAL CONFIRMATION\n\n' +
                  'This action CANNOT be undone!\n\n' +
                  'Click OK to DELETE ALL ' + clients.length + ' client records.'
                );
                
                if (!secondConfirm) {
                  console.log('User cancelled second confirmation');
                  return;
                }

                try {
                  console.log('[DATABASE] 🗑️ Clearing all ClientCRM data...');
                  toast.info('Clearing ClientCRM data...');

                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/clients/clear-all`,
                    {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${publicAnonKey}`,
                      }
                    }
                  );

                  console.log('Response status:', response.status);

                  if (response.ok) {
                    const data = await response.json();
                    console.log('[DATABASE] ✅ ClientCRM data cleared:', data);
                    toast.success('✅ SUCCESS! ClientCRM data has been cleared!', { duration: 5000 });
                    await loadDatabase();
                  } else {
                    const errorData = await response.json();
                    console.error('[DATABASE] ❌ Failed:', errorData);
                    toast.error('❌ Failed: ' + (errorData.error || 'Unknown error'));
                  }
                } catch (error) {
                  console.error('[DATABASE] ❌ Error:', error);
                  toast.error('❌ Error clearing data');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
              style={{ pointerEvents: 'auto', zIndex: 50 }}
              type="button"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Clients ({clients.length})
            </button>

            <Button
              onClick={handleDailyArchive}
              variant="outline"
              className="border-2 border-orange-300 hover:bg-orange-50 text-orange-700"
              disabled={loading}
            >
              <Archive className="w-4 h-4 mr-2" />
              <Clock className="w-4 h-4 mr-2" />
              Run Daily Archive
            </Button>

            <Button
              onClick={handleCompleteReset}
              variant="outline"
              className="border-2 border-red-500 hover:bg-red-50 text-red-700 font-semibold"
              disabled={loading}
            >
              <Database className="w-4 h-4 mr-2" />
              <Trash2 className="w-4 h-4 mr-2" />
              Reset Database
            </Button>
            
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600" onClick={() => setImportDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
                <DialogDescription>
                  Upload a CSV file or paste data directly. Preview before saving to database.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Import Type Selection */}
                <div>
                  <Label>Import Type</Label>
                  <Select value={importType} onValueChange={(v: any) => { setImportType(v); resetImport(); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clients">Prospective Clients</SelectItem>
                      <SelectItem value="customers">Existing Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Download Sample Files */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileDown className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-2">Download Sample Template</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Download a sample CSV file to see the correct format for importing {importType}.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSampleFile('clients')}
                          className="border-blue-300 hover:bg-blue-100"
                        >
                          <FileDown className="w-4 h-4 mr-2" />
                          Clients Sample
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSampleFile('customers')}
                          className="border-blue-300 hover:bg-blue-100"
                        >
                          <FileDown className="w-4 h-4 mr-2" />
                          Customers Sample
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <Label>Upload CSV File</Label>
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Or paste data manually below
                  </p>
                </div>

                {/* Manual Text Input */}
                <div>
                  <Label>Data (CSV or Tab-separated)</Label>
                  <Textarea
                    placeholder={importType === 'clients' 
                      ? "name,email,phone,company,source,customerType,flightInfo,notes\nJohn Doe,john@example.com,+234 123 456 7890,ABC Corp,Website,Corporate,Emirates EK-785,Notes here"
                      : "name,email,phone,company,bookingReference,destination,travelDate,packageType,customerType,flightInfo,notes\nSarah Johnson,sarah@example.com,+234 123 456 7890,Global Tech Solutions,BTM001,Dubai,2024-12-15,Luxury,Corporate,Emirates EK-785,VIP customer"
                    }
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Preview Button */}
                {!showPreview && (
                  <Button 
                    onClick={handlePreviewFromText} 
                    disabled={!importText.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Data
                  </Button>
                )}

                {/* Preview Table */}
                {showPreview && previewData.length > 0 && (
                  <div className="space-y-3">
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Preview: {previewData.length} records ready to import
                      </AlertDescription>
                    </Alert>

                    <div className="border rounded-lg overflow-hidden">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {importType === 'clients' ? (
                                <>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Company</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Flight</TableHead>
                                  <TableHead>Source</TableHead>
                                </>
                              ) : (
                                <>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Booking Ref</TableHead>
                                  <TableHead>Destination</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Flight</TableHead>
                                </>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewData.slice(0, 50).map((record, idx) => (
                              <TableRow key={idx}>
                                {importType === 'clients' ? (
                                  <>
                                    <TableCell>{record.name || '—'}</TableCell>
                                    <TableCell>{record.phone || '—'}</TableCell>
                                    <TableCell>{record.company || '—'}</TableCell>
                                    <TableCell>
                                      {record.customerType && (
                                        <Badge variant="outline" className={
                                          record.customerType === 'Corporate' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                          record.customerType === 'Retails' ? 'bg-green-50 text-green-700 border-green-300' :
                                          record.customerType === 'Channel' ? 'bg-purple-50 text-purple-700 border-purple-300' : ''
                                        }>
                                          {record.customerType}
                                        </Badge>
                                      )}
                                      {!record.customerType && '—'}
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate">{record.flightInfo || record.flightinfo || '—'}</TableCell>
                                    <TableCell>{record.source || '—'}</TableCell>
                                  </>
                                ) : (
                                  <>
                                    <TableCell>{record.name || '—'}</TableCell>
                                    <TableCell>{record.phone || '—'}</TableCell>
                                    <TableCell>{record.bookingreference || record.bookingReference || '—'}</TableCell>
                                    <TableCell>{record.destination || '—'}</TableCell>
                                    <TableCell>
                                      {record.customerType && (
                                        <Badge variant="outline" className={
                                          record.customerType === 'Corporate' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                          record.customerType === 'Retails' ? 'bg-green-50 text-green-700 border-green-300' :
                                          record.customerType === 'Channel' ? 'bg-purple-50 text-purple-700 border-purple-300' : ''
                                        }>
                                          {record.customerType}
                                        </Badge>
                                      )}
                                      {!record.customerType && '—'}
                                    </TableCell>
                                    <TableCell className="max-w-[150px] truncate">{record.flightInfo || record.flightinfo || '—'}</TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                      {previewData.length > 50 && (
                        <div className="bg-gray-50 p-2 text-center text-sm text-gray-600">
                          Showing first 50 of {previewData.length} records
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={resetImport} 
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel & Edit
                      </Button>
                      <Button 
                        onClick={handleConfirmImport} 
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : `Save ${previewData.length} Records`}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        </div>

        {/* Daily Archive Info */}
        <Alert className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Automatic Daily Archive:</strong> All completed calls are automatically archived daily at 00:00 AM (midnight). 
            This clears agents' lists so fresh numbers can be assigned each day. You can also manually trigger the archive using the button above.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-purple-200 bg-white/60 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-purple-700">Prospective Clients</CardTitle>
              <CardDescription>Available in database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4">
                <div className="text-4xl font-bold text-purple-600">{clients.length}</div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Clear All button clicked!');
                    handleClearAllClients();
                  }}
                  className="bg-gradient-to-br from-orange-600 to-red-600 relative z-50 cursor-pointer hover:opacity-90"
                  style={{ pointerEvents: 'auto' }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-white/60 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-blue-700">Existing Customers</CardTitle>
              <CardDescription>Available in database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{customers.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">Prospective Clients</TabsTrigger>
            <TabsTrigger value="customers">Existing Customers</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            {/* Assignment Card */}
            <Card className="bg-white/60 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Assign Clients to Agent</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        loadUsers();
                        toast.info('Refreshing agent list...');
                      }}
                      className="border-green-500 text-green-700 hover:bg-green-50"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Refresh Agents
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className={hasActiveFilters ? 'border-purple-500 text-purple-700' : ''}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters {hasActiveFilters && `(${filterCustomerType.length + (filterFlightInfo ? 1 : 0)})`}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Assign clients from database to agents for daily calling
                  {users.length === 0 && (
                    <span className="block mt-1 text-orange-600 font-medium">
                      ⚠️ No agents available. Create agents in Admin → User Management first.
                    </span>
                  )}
                  {users.length > 0 && (
                    <span className="block mt-1 text-green-600 font-medium">
                      ✓ {users.length} agent{users.length !== 1 ? 's' : ''} available
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters Section */}
                {showFilters && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-purple-900">Smart Filters</h4>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Type Filter */}
                      <div>
                        <Label className="text-purple-900 mb-2 block">Customer Type</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Corporate', 'Retails', 'Channel'].map((type) => (
                            <Badge
                              key={type}
                              variant={filterCustomerType.includes(type) ? 'default' : 'outline'}
                              className={`cursor-pointer transition-all ${
                                filterCustomerType.includes(type)
                                  ? type === 'Corporate' ? 'bg-blue-600 hover:bg-blue-700' :
                                    type === 'Retails' ? 'bg-green-600 hover:bg-green-700' :
                                    'bg-purple-600 hover:bg-purple-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => toggleCustomerTypeFilter(type)}
                            >
                              {filterCustomerType.includes(type) && <Check className="w-3 h-3 mr-1" />}
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Flight Filter */}
                      <div>
                        <Label htmlFor="flight-filter" className="text-purple-900 mb-2 block">
                          <Plane className="w-4 h-4 inline mr-1" />
                          Flight/Airline
                        </Label>
                        <Input
                          id="flight-filter"
                          placeholder="e.g. Emirates, EK-785, Turkish"
                          value={filterFlightInfo}
                          onChange={(e) => setFilterFlightInfo(e.target.value)}
                          className="border-purple-300"
                        />
                      </div>
                    </div>
                    
                    {/* Filter Summary */}
                    <Alert className="bg-white/80">
                      <AlertDescription>
                        <strong>Filtered Results:</strong> {filteredClients.length} of {clients.length} clients
                        {hasActiveFilters && (
                          <span className="ml-2 text-purple-600">
                            ({filterCustomerType.length > 0 && `Type: ${filterCustomerType.join(', ')}`}
                            {filterFlightInfo && ` • Flight: ${filterFlightInfo}`})
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {/* Assignment Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Select Agent</Label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose agent..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">
                            No agents found. Create agents in Admin → User Management.
                          </div>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Number of Clients</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      value={assignCount}
                      onChange={(e) => setAssignCount(e.target.value)}
                      min="1"
                      max={hasActiveFilters ? filteredClients.length : clients.length}
                    />
                    {hasActiveFilters && (
                      <p className="text-xs text-purple-600 mt-1">
                        Max: {filteredClients.length} filtered
                      </p>
                    )}
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => handleAssign('clients')}
                      disabled={loading || !selectedAgent || !assignCount}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Assign {hasActiveFilters && '(Filtered)'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle>Database Records</CardTitle>
                <CardDescription>
                  {hasActiveFilters ? (
                    <>Showing {filteredClients.length} of {clients.length} clients (filtered)</>
                  ) : (
                    <>{clients.length} prospective clients in database</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Flight Info</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-500">
                            {hasActiveFilters ? 'No clients match the current filters.' : 'No clients in database. Import data to get started.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.phone}</TableCell>
                            <TableCell>{client.company || '—'}</TableCell>
                            <TableCell>
                              {client.customerType ? (
                                <Badge variant="outline" className={
                                  client.customerType === 'Corporate' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                  client.customerType === 'Retails' ? 'bg-green-50 text-green-700 border-green-300' :
                                  client.customerType === 'Channel' ? 'bg-purple-50 text-purple-700 border-purple-300' : ''
                                }>
                                  {client.customerType}
                                </Badge>
                              ) : '—'}
                            </TableCell>
                            <TableCell>
                              {client.flightInfo ? (
                                <span className="text-sm flex items-center gap-1">
                                  <Plane className="w-3 h-3 text-gray-500" />
                                  {client.flightInfo}
                                </span>
                              ) : '—'}
                            </TableCell>
                            <TableCell>
                              {client.source && <Badge variant="outline">{client.source}</Badge>}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {new Date(client.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete('clients', client.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            {/* Assignment Card */}
            <Card className="bg-white/60 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Assign Customers to Agent</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        loadUsers();
                        toast.info('Refreshing agent list...');
                      }}
                      className="border-green-500 text-green-700 hover:bg-green-50"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Refresh Agents
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className={hasActiveFilters ? 'border-blue-500 text-blue-700' : ''}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters {hasActiveFilters && `(${filterCustomerType.length + (filterFlightInfo ? 1 : 0)})`}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Assign customers from database to agents for service calls
                  {users.length === 0 && (
                    <span className="block mt-1 text-orange-600 font-medium">
                      ⚠️ No agents available. Create agents in Admin → User Management first.
                    </span>
                  )}
                  {users.length > 0 && (
                    <span className="block mt-1 text-green-600 font-medium">
                      ✓ {users.length} agent{users.length !== 1 ? 's' : ''} available
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters Section */}
                {showFilters && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-blue-900">Smart Filters</h4>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Type Filter */}
                      <div>
                        <Label className="text-blue-900 mb-2 block">Customer Type</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Corporate', 'Retails', 'Channel'].map((type) => (
                            <Badge
                              key={type}
                              variant={filterCustomerType.includes(type) ? 'default' : 'outline'}
                              className={`cursor-pointer transition-all ${
                                filterCustomerType.includes(type)
                                  ? type === 'Corporate' ? 'bg-blue-600 hover:bg-blue-700' :
                                    type === 'Retails' ? 'bg-green-600 hover:bg-green-700' :
                                    'bg-purple-600 hover:bg-purple-700'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => toggleCustomerTypeFilter(type)}
                            >
                              {filterCustomerType.includes(type) && <Check className="w-3 h-3 mr-1" />}
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Flight Filter */}
                      <div>
                        <Label htmlFor="customer-flight-filter" className="text-blue-900 mb-2 block">
                          <Plane className="w-4 h-4 inline mr-1" />
                          Flight/Airline
                        </Label>
                        <Input
                          id="customer-flight-filter"
                          placeholder="e.g. Emirates, EK-785, Turkish"
                          value={filterFlightInfo}
                          onChange={(e) => setFilterFlightInfo(e.target.value)}
                          className="border-blue-300"
                        />
                      </div>
                    </div>
                    
                    {/* Filter Summary */}
                    <Alert className="bg-white/80">
                      <AlertDescription>
                        <strong>Filtered Results:</strong> {filteredCustomers.length} of {customers.length} customers
                        {hasActiveFilters && (
                          <span className="ml-2 text-blue-600">
                            ({filterCustomerType.length > 0 && `Type: ${filterCustomerType.join(', ')}`}
                            {filterFlightInfo && ` • Flight: ${filterFlightInfo}`})
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {/* Assignment Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Select Agent</Label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose agent..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">
                            No agents found. Create agents in Admin → User Management.
                          </div>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Number of Customers</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 20"
                      value={assignCount}
                      onChange={(e) => setAssignCount(e.target.value)}
                      min="1"
                      max={hasActiveFilters ? filteredCustomers.length : customers.length}
                    />
                    {hasActiveFilters && (
                      <p className="text-xs text-blue-600 mt-1">
                        Max: {filteredCustomers.length} filtered
                      </p>
                    )}
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => handleAssign('customers')}
                      disabled={loading || !selectedAgent || !assignCount}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Assign {hasActiveFilters && '(Filtered)'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Database Records</CardTitle>
                <CardDescription>
                  {hasActiveFilters ? (
                    <>Showing {filteredCustomers.length} of {customers.length} customers (filtered)</>
                  ) : (
                    <>{customers.length} existing customers in database</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Booking Ref</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Flight Info</TableHead>
                        <TableHead>Travel Date</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center text-gray-500">
                            {hasActiveFilters ? 'No customers match the current filters.' : 'No customers in database. Import data to get started.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell>{customer.company || '—'}</TableCell>
                            <TableCell>{customer.bookingReference || '—'}</TableCell>
                            <TableCell>{customer.destination || '—'}</TableCell>
                            <TableCell>
                              {customer.customerType ? (
                                <Badge variant="outline" className={
                                  customer.customerType === 'Corporate' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                  customer.customerType === 'Retails' ? 'bg-green-50 text-green-700 border-green-300' :
                                  customer.customerType === 'Channel' ? 'bg-purple-50 text-purple-700 border-purple-300' : ''
                                }>
                                  {customer.customerType}
                                </Badge>
                              ) : '—'}
                            </TableCell>
                            <TableCell>
                              {customer.flightInfo ? (
                                <span className="text-sm flex items-center gap-1">
                                  <Plane className="w-3 h-3 text-gray-500" />
                                  {customer.flightInfo}
                                </span>
                              ) : '—'}
                            </TableCell>
                            <TableCell>
                              {customer.travelDate ? new Date(customer.travelDate).toLocaleDateString() : '—'}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete('customers', customer.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
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
    </div>
  );
}
