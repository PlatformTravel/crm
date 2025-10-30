// Archive Manager Component - Redesigned with Beautiful Gradients
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Alert, AlertDescription } from "./ui/alert";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Archive, 
  RefreshCw, 
  Search,
  Trash2,
  Download,
  AlertCircle,
  FileArchive,
  Calendar,
  Phone,
  Mail,
  RotateCcw,
  Package
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { backendService } from "../utils/backendService";

interface ArchivedRecord {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  company?: string;
  type: 'client' | 'customer';
  archivedAt: string;
  archivedBy: string;
  reason?: string;
  callOutcome?: string;
}

export function ArchiveManager() {
  const [archivedRecords, setArchivedRecords] = useState<ArchivedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "client" | "customer">("all");

  useEffect(() => {
    loadArchivedRecords();
    
    const interval = setInterval(loadArchivedRecords, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadArchivedRecords = async () => {
    try {
      const data = await backendService.getAllArchived();

      if (data.success && data.records) {
        const records = data.records.map((record: any) => ({
          id: record.id,
          name: record.name || record.numberData?.name || record.entityData?.name || 'N/A',
          phone: record.phone || record.numberData?.phone || record.entityData?.phone || record.phoneNumber || 'N/A',
          email: record.email || record.numberData?.email || record.entityData?.email || '',
          company: record.company || record.numberData?.company || record.entityData?.company || '',
          type: record.type || record.entityType || 'client',
          archivedAt: record.archivedAt || new Date().toISOString(),
          archivedBy: record.archivedBy || record.agentName || 'System',
          callOutcome: record.callOutcome || record.outcome || 'N/A',
        }));

        setArchivedRecords(records);
        console.log(`[ARCHIVE] Loaded ${records.length} archived records`);
      } else {
        setArchivedRecords([]);
      }
    } catch (error) {
      console.error("Failed to load archived records:", error);
      setArchivedRecords([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadArchivedRecords();
  };

  const handleRestore = async (record: ArchivedRecord) => {
    try {
      toast.loading("Restoring record...");
      
      const result = await backendService.restoreFromArchive(record.id, record.type);
      
      if (result.success) {
        toast.success(`${record.type === 'client' ? 'Client' : 'Customer'} restored successfully`);
        loadArchivedRecords();
      } else {
        toast.error(result.error || "Failed to restore record");
      }
    } catch (error) {
      console.error("Failed to restore record:", error);
      toast.error("Failed to restore record");
    }
  };

  const handlePermanentDelete = async (recordId: string) => {
    if (!confirm("Are you sure you want to permanently delete this record? This action cannot be undone.")) {
      return;
    }

    try {
      toast.loading("Deleting record...");
      
      const result = await backendService.deleteFromArchive(recordId);
      
      if (result.success) {
        toast.success("Record permanently deleted");
        loadArchivedRecords();
      } else {
        toast.error(result.error || "Failed to delete record");
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
      toast.error("Failed to delete record");
    }
  };

  const filteredRecords = archivedRecords.filter(record => {
    const matchesSearch = 
      record.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.phone.includes(searchQuery) ||
      record.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || record.type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 blur-xl"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 p-8 shadow-2xl shadow-orange-500/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
              <Archive className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-white mb-1">Archive</h1>
              <p className="text-white/90 text-sm">
                View and manage archived records
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing} 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              disabled={archivedRecords.length === 0}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-12 -mt-12"></div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/10">
                    <FileArchive className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm text-amber-700">Total Archived</span>
                </div>
                <div className="text-2xl text-amber-900 mb-1">{archivedRecords.length}</div>
                <p className="text-xs text-amber-600/70">
                  All records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12"></div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-blue-700">Archived Clients</span>
                </div>
                <div className="text-2xl text-blue-900 mb-1">
                  {archivedRecords.filter(r => r.type === 'client').length}
                </div>
                <p className="text-xs text-blue-600/70">
                  Prospective clients
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-12 -mt-12"></div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-green-500/10">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-green-700">Archived Customers</span>
                </div>
                <div className="text-2xl text-green-900 mb-1">
                  {archivedRecords.filter(r => r.type === 'customer').length}
                </div>
                <p className="text-xs text-green-600/70">
                  Existing customers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archived Records Card */}
      <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-xl">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-orange-50/50 to-amber-50/50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              Archived Records
            </div>
            <Badge variant="secondary" className="bg-white/80">
              {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
            </Badge>
          </CardTitle>
          <CardDescription>Search and filter archived records</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/80 border-orange-200/50 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                size="sm"
                className={filterType === "all" ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg" : "border-orange-200 hover:bg-orange-50"}
              >
                All
              </Button>
              <Button
                variant={filterType === "client" ? "default" : "outline"}
                onClick={() => setFilterType("client")}
                size="sm"
                className={filterType === "client" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" : "border-blue-200 hover:bg-blue-50"}
              >
                Clients
              </Button>
              <Button
                variant={filterType === "customer" ? "default" : "outline"}
                onClick={() => setFilterType("customer")}
                size="sm"
                className={filterType === "customer" ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg" : "border-green-200 hover:bg-green-50"}
              >
                Customers
              </Button>
            </div>
          </div>

          {/* Records Table */}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 mb-4">
                <Archive className="w-10 h-10 text-orange-500 opacity-50" />
              </div>
              <p className="text-muted-foreground mb-2">No archived records found</p>
              <p className="text-sm text-muted-foreground/70">
                Records will appear here when they are archived after being called and completed
              </p>
            </div>
          ) : (
            <div className="border border-orange-100/50 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-md">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent border-orange-100/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Archived Date</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record, index) => (
                      <TableRow 
                        key={record.id}
                        className="hover:bg-orange-50/30 transition-colors animate-in fade-in duration-300"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <TableCell>
                          <div>
                            <p className="">{record.name || "N/A"}</p>
                            {record.company && (
                              <p className="text-sm text-muted-foreground">{record.company}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{record.phone}</TableCell>
                        <TableCell className="text-muted-foreground">{record.email || "N/A"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary"
                            className={record.type === 'client' 
                              ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200" 
                              : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200"
                            }
                          >
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(record.archivedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-orange-200 text-orange-700">
                            {record.callOutcome || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(record)}
                              className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Restore
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePermanentDelete(record.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert className="border-0 bg-gradient-to-r from-orange-50 to-amber-50 shadow-md">
        <AlertCircle className="w-4 h-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          <strong>Archive System:</strong> Records are automatically archived when agents complete calls. 
          Archived records can be restored to the database or permanently deleted. 
          Archives are retained for 90 days by default before automatic permanent deletion.
        </AlertDescription>
      </Alert>
    </div>
  );
}
