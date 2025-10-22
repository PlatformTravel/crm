import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Archive, Phone, Mail, ArchiveRestore, Search, User, ShoppingBag, Calendar, Building2, AlertCircle, PhoneCall, MessageSquare, Clock, CheckSquare, Square } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useThreeCX } from './ThreeCXContext';
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";

interface ArchivedCall {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  businessType?: string;
  notes?: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: string;
  archivedAt: string;
  archivedBy?: string;
  lastContact?: string;
  callbackCount?: number;
  previousNotes?: string;
  isCallback?: boolean;
}

export function ArchiveManager() {
  const [archivedClients, setArchivedClients] = useState<ArchivedCall[]>([]);
  const [archivedCustomers, setArchivedCustomers] = useState<ArchivedCall[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoreType, setRestoreType] = useState<'clients' | 'customers'>('clients');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { makeCall } = useThreeCX();

  // Load archived data on mount
  useEffect(() => {
    loadArchivedData();
  }, []);

  const loadArchivedData = async () => {
    setIsLoading(true);
    try {
      // Load archived clients from centralized database
      const clientsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/clients/archive`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        if (clientsData.success && clientsData.records) {
          setArchivedClients(clientsData.records);
        }
      }

      // Load archived customers from centralized database
      const customersResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/customers/archive`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        if (customersData.success && customersData.records) {
          setArchivedCustomers(customersData.records);
        }
      }
    } catch (error) {
      console.error('[ARCHIVE MANAGER] Error loading archived data:', error);
      toast.error("Failed to load archived data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallContact = (phone: string, name: string) => {
    makeCall(phone, name);
    toast.success(`Initiating call to ${name}`);
  };

  const handleSelectAll = (type: 'clients' | 'customers', checked: boolean) => {
    if (checked) {
      const ids = type === 'clients' 
        ? filteredClients.map(c => c.id)
        : filteredCustomers.map(c => c.id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleRestoreClick = (type: 'clients' | 'customers') => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one record to restore");
      return;
    }
    setRestoreType(type);
    setRestoreDialogOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (selectedIds.length === 0) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/database/${restoreType}/archive/bulk-restore`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ recordIds: selectedIds })
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Records restored to database for callback");
        
        // Reload archived data
        await loadArchivedData();
        setSelectedIds([]);
        setRestoreDialogOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to restore records");
      }
    } catch (error) {
      console.error('[ARCHIVE MANAGER] Error restoring records:', error);
      toast.error("Failed to restore records");
    }
  };

  const filteredClients = archivedClients.filter(client =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.includes(searchQuery) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCustomers = archivedCustomers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Archive Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            View and restore completed calls from archive for callback
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl px-6 py-3 shadow-xl">
            <div className="text-sm opacity-90">Total Archived</div>
            <div className="text-3xl font-bold">{archivedClients.length + archivedCustomers.length}</div>
          </div>
        </div>
      </div>

      {/* Alert Info */}
      <Alert className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Archive Manager:</strong> View all completed calls that have been archived. Select records to restore them back to the database for callback assignments.
        </AlertDescription>
      </Alert>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
        <Input
          placeholder="🔍 Search archived records by name, email, phone, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-white/80 backdrop-blur-xl border-2 border-orange-200 shadow-lg focus:shadow-xl focus:shadow-orange-500/20 focus:border-orange-400 transition-all rounded-xl"
        />
      </div>

      {/* Tabs for Clients and Customers */}
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-gradient-to-r from-orange-100 to-amber-100 p-1 rounded-xl">
          <TabsTrigger value="clients" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
            <User className="w-4 h-4 mr-2" />
            Archived Clients ({filteredClients.length})
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Archived Customers ({filteredCustomers.length})
          </TabsTrigger>
        </TabsList>

        {/* Archived Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <span className="text-blue-900 font-semibold">{selectedIds.length} record(s) selected</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedIds([])}
                  variant="outline"
                  size="sm"
                  className="border-blue-300"
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={() => handleRestoreClick('clients')}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                >
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore for Callback
                </Button>
              </div>
            </div>
          )}

          <Card className="bg-white/80 backdrop-blur-xl border-2 border-orange-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Archived Clients
                    </CardTitle>
                    <CardDescription>Completed client calls ready for callback</CardDescription>
                  </div>
                </div>
                {filteredClients.length > 0 && (
                  <Button
                    onClick={() => handleSelectAll('clients', selectedIds.length !== filteredClients.length)}
                    variant="outline"
                    size="sm"
                    className="border-orange-300"
                  >
                    {selectedIds.length === filteredClients.length ? (
                      <>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Select All
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-20">
                  <Archive className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg text-muted-foreground">No archived clients found</p>
                  <p className="text-sm text-muted-foreground mt-2">Completed calls will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-100">
                      <TableHead className="text-orange-900 font-bold w-12"></TableHead>
                      <TableHead className="text-orange-900 font-bold">Client</TableHead>
                      <TableHead className="text-orange-900 font-bold">Phone</TableHead>
                      <TableHead className="text-orange-900 font-bold">Company</TableHead>
                      <TableHead className="text-orange-900 font-bold">Assigned To</TableHead>
                      <TableHead className="text-orange-900 font-bold">Archived</TableHead>
                      <TableHead className="text-orange-900 font-bold">Notes</TableHead>
                      <TableHead className="text-orange-900 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client, index) => {
                      const rowColors = [
                        'hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50',
                        'hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50',
                      ];
                      
                      return (
                        <TableRow key={client.id} className={`border-b border-orange-100 transition-all ${rowColors[index % 2]}`}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(client.id)}
                              onCheckedChange={(checked) => handleSelectOne(client.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-semibold shadow-lg">
                                {client.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{client.name}</div>
                                {client.email && (
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {client.email}
                                  </div>
                                )}
                                {client.isCallback && client.callbackCount && (
                                  <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 text-xs mt-1">
                                    <PhoneCall className="w-3 h-3 mr-1" />
                                    Callback #{client.callbackCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-orange-500" />
                              <span className="font-mono">{client.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {client.company ? (
                              <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                                <Building2 className="w-3 h-3 mr-1" />
                                {client.company}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{client.assignedToName || 'Unknown'}</div>
                              {client.assignedAt && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(client.assignedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {client.archivedAt ? new Date(client.archivedAt).toLocaleDateString() : 'Unknown'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {client.notes ? (
                              <div className="max-w-xs truncate text-sm" title={client.notes}>
                                <MessageSquare className="w-4 h-4 inline mr-1 text-blue-500" />
                                {client.notes}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No notes</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleCallContact(client.phone, client.name)}
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archived Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <span className="text-blue-900 font-semibold">{selectedIds.length} record(s) selected</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedIds([])}
                  variant="outline"
                  size="sm"
                  className="border-blue-300"
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={() => handleRestoreClick('customers')}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                >
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore for Callback
                </Button>
              </div>
            </div>
          )}

          <Card className="bg-white/80 backdrop-blur-xl border-2 border-orange-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Archived Customers
                    </CardTitle>
                    <CardDescription>Completed customer calls ready for callback</CardDescription>
                  </div>
                </div>
                {filteredCustomers.length > 0 && (
                  <Button
                    onClick={() => handleSelectAll('customers', selectedIds.length !== filteredCustomers.length)}
                    variant="outline"
                    size="sm"
                    className="border-orange-300"
                  >
                    {selectedIds.length === filteredCustomers.length ? (
                      <>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Select All
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-20">
                  <Archive className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg text-muted-foreground">No archived customers found</p>
                  <p className="text-sm text-muted-foreground mt-2">Completed calls will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-100">
                      <TableHead className="text-orange-900 font-bold w-12"></TableHead>
                      <TableHead className="text-orange-900 font-bold">Customer</TableHead>
                      <TableHead className="text-orange-900 font-bold">Phone</TableHead>
                      <TableHead className="text-orange-900 font-bold">Company</TableHead>
                      <TableHead className="text-orange-900 font-bold">Assigned To</TableHead>
                      <TableHead className="text-orange-900 font-bold">Archived</TableHead>
                      <TableHead className="text-orange-900 font-bold">Notes</TableHead>
                      <TableHead className="text-orange-900 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer, index) => {
                      const rowColors = [
                        'hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50',
                        'hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50',
                      ];
                      
                      return (
                        <TableRow key={customer.id} className={`border-b border-orange-100 transition-all ${rowColors[index % 2]}`}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(customer.id)}
                              onCheckedChange={(checked) => handleSelectOne(customer.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-semibold shadow-lg">
                                {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{customer.name}</div>
                                {customer.email && (
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {customer.email}
                                  </div>
                                )}
                                {customer.isCallback && customer.callbackCount && (
                                  <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 text-xs mt-1">
                                    <PhoneCall className="w-3 h-3 mr-1" />
                                    Callback #{customer.callbackCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-orange-500" />
                              <span className="font-mono">{customer.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.company ? (
                              <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                                <Building2 className="w-3 h-3 mr-1" />
                                {customer.company}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{customer.assignedToName || 'Unknown'}</div>
                              {customer.assignedAt && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(customer.assignedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {customer.archivedAt ? new Date(customer.archivedAt).toLocaleDateString() : 'Unknown'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.notes ? (
                              <div className="max-w-xs truncate text-sm" title={customer.notes}>
                                <MessageSquare className="w-4 h-4 inline mr-1 text-blue-500" />
                                {customer.notes}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No notes</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleCallContact(customer.phone, customer.name)}
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Records for Callback?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore {selectedIds.length} selected record(s) back to the database for reassignment as callback contacts. 
              They will be marked as callback records and can be assigned to agents again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmRestore}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <ArchiveRestore className="w-4 h-4 mr-2" />
              Restore for Callback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
