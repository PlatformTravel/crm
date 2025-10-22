import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Shield, Search, Download, Calendar as CalendarIcon, Filter, CheckCircle, XCircle, Clock, User, Monitor, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LoginAuditEntry {
  id: string;
  username: string;
  name: string;
  role: string;
  timestamp: string;
  status: 'success' | 'failed' | 'logout';
  ipAddress: string;
  browser: string;
  device: string;
  location: string;
  sessionDuration?: string;
  failureReason?: string;
}

// Mock data - in production, this would come from backend
const mockAuditLogs: LoginAuditEntry[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Admin User',
    role: 'admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    status: 'success',
    ipAddress: '102.89.23.45',
    browser: 'Chrome 119',
    device: 'Windows Desktop',
    location: 'Lagos, Nigeria',
    sessionDuration: '15m active'
  },
  {
    id: '2',
    username: 'agent',
    name: 'Agent User',
    role: 'agent',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    status: 'success',
    ipAddress: '102.89.23.78',
    browser: 'Safari 17',
    device: 'iPhone 14',
    location: 'Abuja, Nigeria',
    sessionDuration: '45m active'
  },
  {
    id: '3',
    username: 'manager',
    name: 'Manager User',
    role: 'manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'logout',
    ipAddress: '102.89.24.12',
    browser: 'Firefox 120',
    device: 'MacBook Pro',
    location: 'Port Harcourt, Nigeria',
    sessionDuration: '1h 23m'
  },
  {
    id: '4',
    username: 'john.doe',
    name: 'Unknown',
    role: 'N/A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    status: 'failed',
    ipAddress: '196.45.123.89',
    browser: 'Chrome 119',
    device: 'Android Phone',
    location: 'Kano, Nigeria',
    failureReason: 'Invalid credentials'
  },
  {
    id: '5',
    username: 'admin',
    name: 'Admin User',
    role: 'admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    status: 'logout',
    ipAddress: '102.89.23.45',
    browser: 'Chrome 119',
    device: 'Windows Desktop',
    location: 'Lagos, Nigeria',
    sessionDuration: '4h 12m'
  },
  {
    id: '6',
    username: 'test.user',
    name: 'Unknown',
    role: 'N/A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    status: 'failed',
    ipAddress: '197.210.78.34',
    browser: 'Chrome 118',
    device: 'Windows Desktop',
    location: 'Ibadan, Nigeria',
    failureReason: 'Account not found'
  },
  {
    id: '7',
    username: 'manager',
    name: 'Manager User',
    role: 'manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    status: 'success',
    ipAddress: '102.89.24.12',
    browser: 'Firefox 120',
    device: 'MacBook Pro',
    location: 'Port Harcourt, Nigeria',
    sessionDuration: '1h 23m'
  },
  {
    id: '8',
    username: 'agent',
    name: 'Agent User',
    role: 'agent',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'logout',
    ipAddress: '102.89.23.78',
    browser: 'Safari 17',
    device: 'iPhone 14',
    location: 'Abuja, Nigeria',
    sessionDuration: '8h 45m'
  }
];

export function LoginAudit() {
  const [auditLogs, setAuditLogs] = useState<LoginAuditEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LoginAuditEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // Load logs from localStorage on mount
  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = () => {
    try {
      const storedLogs = localStorage.getItem('loginAuditLogs');
      if (storedLogs) {
        const logs = JSON.parse(storedLogs);
        setAuditLogs(logs);
      } else {
        // If no logs, show mock data
        setAuditLogs(mockAuditLogs);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      setAuditLogs(mockAuditLogs);
    }
  };

  // Format relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...auditLogs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery) ||
        log.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(log => log.role === roleFilter);
    }

    // Date filters
    if (dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= dateTo);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, statusFilter, roleFilter, dateFrom, dateTo, auditLogs]);

  // Statistics
  const totalLogins = auditLogs.filter(log => log.status === 'success').length;
  const failedAttempts = auditLogs.filter(log => log.status === 'failed').length;
  const activeUsers = auditLogs.filter(log => 
    log.status === 'success' && 
    new Date(log.timestamp) > new Date(Date.now() - 3600000) // Last hour
  ).length;

  const handleExportAudit = () => {
    const csvContent = [
      ['Timestamp', 'Username', 'Name', 'Role', 'Status', 'IP Address', 'Location', 'Device', 'Browser', 'Session Duration', 'Failure Reason'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.username,
        log.name,
        log.role,
        log.status,
        log.ipAddress,
        log.location,
        log.device,
        log.browser,
        log.sessionDuration || '',
        log.failureReason || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `login-audit-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Audit log exported successfully');
  };

  const handleRefresh = () => {
    loadAuditLogs();
    toast.success('Audit log refreshed');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    toast.info('Filters cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Login Audit Trail
          </h2>
          <p className="text-muted-foreground">Monitor all authentication activities and user sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportAudit} className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              Successful Logins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{totalLogins}</div>
            <p className="text-xs text-green-600 mt-1">Total authenticated sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-red-700">
              <XCircle className="w-4 h-4" />
              Failed Attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{failedAttempts}</div>
            <p className="text-xs text-red-600 mt-1">Blocked or invalid logins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-blue-700">
              <User className="w-4 h-4" />
              Active Now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{activeUsers}</div>
            <p className="text-xs text-blue-600 mt-1">Currently logged in</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-purple-700">
              <Clock className="w-4 h-4" />
              Total Events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{auditLogs.length}</div>
            <p className="text-xs text-purple-600 mt-1">All audit records</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/60 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search username, IP, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button onClick={clearFilters} variant="outline">
              Clear All
            </Button>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? dateFrom.toLocaleDateString() : 'From Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? dateTo.toLocaleDateString() : 'To Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card className="bg-white/60 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {auditLogs.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No audit records found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(log.timestamp).toLocaleDateString('en-GB')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString('en-GB')} ({getRelativeTime(log.timestamp)})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.name}</div>
                          <div className="text-xs text-muted-foreground">@{log.username}</div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {log.role}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.status === 'success' && (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Success
                          </Badge>
                        )}
                        {log.status === 'failed' && (
                          <div>
                            <Badge className="bg-red-100 text-red-700 border-red-300">
                              <XCircle className="w-3 h-3 mr-1" />
                              Failed
                            </Badge>
                            {log.failureReason && (
                              <div className="text-xs text-red-600 mt-1">{log.failureReason}</div>
                            )}
                          </div>
                        )}
                        {log.status === 'logout' && (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Logout
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{log.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">{log.device}</div>
                            <div className="text-xs text-muted-foreground">{log.browser}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        {log.sessionDuration && (
                          <Badge variant="outline">{log.sessionDuration}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Security Insights */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">Security Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {failedAttempts > 0 && (
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-orange-900">
                  {failedAttempts} failed login attempts detected
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  Review failed attempts to identify potential security threats
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-900">
                {activeUsers} users currently active
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Monitor active sessions for unusual activity patterns
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-900">
                All login attempts are being logged
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Maintain compliance with security audit requirements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
