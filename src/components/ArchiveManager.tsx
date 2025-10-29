// Archive Manager Component
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Alert, AlertDescription } from "./ui/alert";
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
  Mail
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "client" | "customer">("all");

  useEffect(() => {
    loadArchivedRecords();
    
    const interval = setInterval(loadArchivedRecords, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadArchivedRecords = async () => {
    try {
      // Load all archived records from backend
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
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <Archive className="w-6 h-6 text-purple-600" />
            Archive Manager
          </h2>
          <p className="text-gray-600 mt-1">View and manage archived records</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadArchivedRecords} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" disabled={archivedRecords.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export Archives
          </Button>
        </div>
      </div>

      {/* Archive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <FileArchive className="w-4 h-4" />
              Total Archived
            </CardDescription>
            <CardTitle className="text-3xl">{archivedRecords.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Archived Clients
            </CardDescription>
            <CardTitle className="text-3xl">
              {archivedRecords.filter(r => r.type === 'client').length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Archived Customers
            </CardDescription>
            <CardTitle className="text-3xl">
              {archivedRecords.filter(r => r.type === 'customer').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Archived Records</CardTitle>
          <CardDescription>Search and filter archived records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterType === "client" ? "default" : "outline"}
                onClick={() => setFilterType("client")}
                size="sm"
              >
                Clients
              </Button>
              <Button
                variant={filterType === "customer" ? "default" : "outline"}
                onClick={() => setFilterType("customer")}
                size="sm"
              >
                Customers
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading archived records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No archived records found</p>
              <p className="text-sm text-gray-400">
                Records will appear here when they are archived after being called and completed
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
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
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.name || "N/A"}</p>
                          {record.company && (
                            <p className="text-sm text-gray-500">{record.company}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{record.phone}</TableCell>
                      <TableCell className="text-gray-500">{record.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={record.type === 'client' ? 'default' : 'secondary'}>
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(record.archivedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.callOutcome || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(record)}
                          >
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handlePermanentDelete(record.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          <strong>Archive System:</strong> Records are automatically archived when agents complete calls. 
          Archived records can be restored to the database or permanently deleted. 
          Archives are retained for 90 days by default before automatic permanent deletion.
        </AlertDescription>
      </Alert>
    </div>
  );
}
