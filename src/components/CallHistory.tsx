import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useThreeCX } from "./ThreeCXContext";
import { Phone, PhoneCall, Clock, Search, Download, Calendar, User, Trash2, Filter, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner@2.0.3";

type SortField = "date" | "contact" | "phone" | "duration" | "status";
type SortDirection = "asc" | "desc";

export function CallHistory() {
  const { callHistory, deleteCallRecord } = useThreeCX();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "date" | "week" | "month">("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [callToDelete, setCallToDelete] = useState<string | null>(null);

  // Get unique weeks and months from call history
  const availableWeeks = useMemo(() => {
    const weeks = new Set<string>();
    callHistory.forEach(call => {
      const weekStart = getWeekStart(call.startTime);
      weeks.add(weekStart);
    });
    return Array.from(weeks).sort().reverse();
  }, [callHistory]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    callHistory.forEach(call => {
      const month = getMonthKey(call.startTime);
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }, [callHistory]);

  // Helper functions for date filtering
  function getWeekStart(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const weekStart = new Date(d.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  }

  function getMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  function isInWeek(date: Date, weekStart: string): boolean {
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekStart);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    return date >= weekStartDate && date <= weekEndDate;
  }

  function isInMonth(date: Date, monthKey: string): boolean {
    const [year, month] = monthKey.split('-').map(Number);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  }

  function formatWeekDisplay(weekStart: string): string {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  function formatMonthDisplay(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Apply all filters and sorting
  const filteredAndSortedCalls = useMemo(() => {
    // First, apply filters
    const filtered = callHistory.filter(call => {
      // Search filter
      const matchesSearch = !searchQuery || 
        call.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.contactName?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Date/Week/Month filter
      if (filterType === "date" && selectedDate) {
        const callDate = call.startTime.toISOString().split('T')[0];
        return callDate === selectedDate;
      } else if (filterType === "week" && selectedWeek) {
        return isInWeek(call.startTime, selectedWeek);
      } else if (filterType === "month" && selectedMonth) {
        return isInMonth(call.startTime, selectedMonth);
      }

      return true;
    });

    // Then, apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "date":
          comparison = a.startTime.getTime() - b.startTime.getTime();
          break;
        case "contact":
          const nameA = (a.contactName || "Unknown").toLowerCase();
          const nameB = (b.contactName || "Unknown").toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case "phone":
          comparison = a.phoneNumber.localeCompare(b.phoneNumber);
          break;
        case "duration":
          comparison = (a.duration || 0) - (b.duration || 0);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [callHistory, searchQuery, filterType, selectedDate, selectedWeek, selectedMonth, sortField, sortDirection]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default descending order (except for contact/phone which default to ascending)
      setSortField(field);
      setSortDirection(field === "contact" || field === "phone" ? "asc" : "desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-40" />;
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  const handleDeleteClick = (callId: string) => {
    setCallToDelete(callId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (callToDelete) {
      deleteCallRecord(callToDelete);
      setDeleteDialogOpen(false);
      setCallToDelete(null);
    }
  };

  const handleExportHistory = () => {
    if (filteredAndSortedCalls.length === 0) {
      toast.error("No call history to export");
      return;
    }

    const csvHeaders = "Date,Time,Contact Name,Phone Number,Duration,Status";
    const csvRows = filteredAndSortedCalls.map(call => {
      const date = new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(call.startTime);
      const time = new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }).format(call.startTime);
      
      return [
        date,
        time,
        call.contactName || "Unknown",
        call.phoneNumber,
        formatDuration(call.duration),
        call.status
      ].map(field => `"${field}"`).join(',');
    });

    const csv = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Generate filename based on filter
    let filename = 'call-history';
    if (filterType === 'date' && selectedDate) {
      filename += `-${selectedDate}`;
    } else if (filterType === 'week' && selectedWeek) {
      filename += `-week-${selectedWeek}`;
    } else if (filterType === 'month' && selectedMonth) {
      filename += `-${selectedMonth}`;
    } else {
      filename += `-${new Date().toISOString().split('T')[0]}`;
    }
    
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`${filteredAndSortedCalls.length} call record(s) exported successfully!`);
  };

  const handleClearFilters = () => {
    setFilterType("all");
    setSelectedDate("");
    setSelectedWeek("");
    setSelectedMonth("");
    setSearchQuery("");
    toast.success("All filters cleared");
  };

  const hasActiveFilters = filterType !== "all" || searchQuery !== "";

  // Calculate stats based on filtered calls
  const getFilteredStats = () => {
    const completedCalls = filteredAndSortedCalls.filter(call => call.status === "ended");
    
    const totalCalls = completedCalls.length;
    const totalDuration = completedCalls.reduce((sum, call) => sum + (call.duration || 0), 0);
    const avgDuration = totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0;

    return { totalCalls, totalDuration, avgDuration };
  };

  const stats = getFilteredStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">
                  {filterType === "all" ? "Total Calls" : "Filtered Calls"}
                </p>
                <p className="text-3xl font-bold mt-1">{stats.totalCalls}</p>
              </div>
              <Phone className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-purple-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Time</p>
                <p className="text-3xl font-bold mt-1">{formatDuration(stats.totalDuration)}</p>
              </div>
              <Clock className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Avg Duration</p>
                <p className="text-3xl font-bold mt-1">{formatDuration(stats.avgDuration)}</p>
              </div>
              <PhoneCall className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call History Table */}
      <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call History
              </CardTitle>
              <CardDescription>
                {hasActiveFilters 
                  ? `Showing ${filteredAndSortedCalls.length} of ${callHistory.length} calls`
                  : `Complete history of all your calls (${callHistory.length} total)`
                }
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="bg-white/60 backdrop-blur-xl border-white/20"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              <Button
                onClick={handleExportHistory}
                disabled={filteredAndSortedCalls.length === 0}
                variant="outline"
                className="bg-white/60 backdrop-blur-xl border-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV ({filteredAndSortedCalls.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter By
                </label>
                <Select value={filterType} onValueChange={(value: any) => {
                  setFilterType(value);
                  if (value === "all") {
                    setSelectedDate("");
                    setSelectedWeek("");
                    setSelectedMonth("");
                  }
                }}>
                  <SelectTrigger className="bg-white/80 border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="date">Specific Date</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filterType === "date" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white/80 border-purple-200"
                  />
                </div>
              )}

              {filterType === "week" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Week
                  </label>
                  <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger className="bg-white/80 border-purple-200">
                      <SelectValue placeholder="Choose a week" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWeeks.map(week => (
                        <SelectItem key={week} value={week}>
                          {formatWeekDisplay(week)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {filterType === "month" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Month
                  </label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="bg-white/80 border-purple-200">
                      <SelectValue placeholder="Choose a month" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMonths.map(month => (
                        <SelectItem key={month} value={month}>
                          {formatMonthDisplay(month)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Customer
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 border-purple-200"
                  />
                </div>
              </div>
            </div>

            {/* Sort Indicator - Clickable */}
            {filteredAndSortedCalls.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 shadow-sm">
                <button
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:bg-white/50 px-3 py-1.5 rounded-md transition-all hover:shadow-sm cursor-pointer group"
                >
                  {sortDirection === "asc" ? (
                    <ArrowUp className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="font-medium">Sorted by:</span>
                  <span className="text-purple-700 font-semibold">
                    {sortField === "date" && "Date & Time"}
                    {sortField === "contact" && "Contact"}
                    {sortField === "phone" && "Phone Number"}
                    {sortField === "duration" && "Duration"}
                    {sortField === "status" && "Status"}
                  </span>
                  <span className="text-purple-600 font-medium">
                    ({sortDirection === "asc" ? "A→Z" : "Z→A"})
                  </span>
                  <span className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to reverse
                  </span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Click column headers to change sort
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            {filteredAndSortedCalls.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Phone className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg">No call history found</p>
                <p className="text-sm mt-1">
                  {searchQuery ? "Try a different search term" : "Make your first call to see history"}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center">
                          Date & Time
                          {getSortIcon("date")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort("contact")}
                      >
                        <div className="flex items-center">
                          Contact
                          {getSortIcon("contact")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort("phone")}
                      >
                        <div className="flex items-center">
                          Phone Number
                          {getSortIcon("phone")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort("duration")}
                      >
                        <div className="flex items-center">
                          Duration
                          {getSortIcon("duration")}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {getSortIcon("status")}
                        </div>
                      </TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedCalls.map((call) => (
                      <TableRow key={call.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {formatDateTime(call.startTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {call.contactName || "Unknown Contact"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-mono text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {call.phoneNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDuration(call.duration)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={call.status === "ended" ? "default" : "secondary"}
                            className={
                              call.status === "ended"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-500"
                            }
                          >
                            {call.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(call.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Call Record
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this call record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/60 hover:bg-white/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
