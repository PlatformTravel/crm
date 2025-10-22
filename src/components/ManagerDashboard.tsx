import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { useUser } from "./UserContext";
import { Users, TrendingUp, Target, Phone, Clock, CheckCircle, AlertCircle, FileText, Calendar, Download, BarChart3, ShoppingBag, Headphones, Mail, CalendarDays, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  dailyTarget: number;
  callsToday: number;
  callsWeek: number;
  callsMonth: number;
  lastCallTime?: string;
  status: 'active' | 'idle' | 'offline';
  // Breakdown by board
  clientCalls: number;
  promoSales: number;
  customerService: number;
  // Additional metrics
  emailsSent: number;
  dealsCreated: number;
  ticketsResolved: number;
}

type ReportPeriod = 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'custom';

export function ManagerDashboard() {
  const { currentUser, hasPermission } = useUser();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('today');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch team performance data from backend
  useEffect(() => {
    fetchTeamPerformance();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchTeamPerformance();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTeamPerformance = async (showToast = false) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8fff4b3c/team-performance`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setTeamMembers(data.teamMembers || []);
          setHasError(false);
          
          if (showToast && data.teamMembers && data.teamMembers.length > 0) {
            toast.success(`Team data refreshed - ${data.teamMembers.length} agents`);
          }
        } else {
          // Silently fail - server returned error
          setHasError(true);
          if (isLoading) {
            setTeamMembers([]);
          }
        }
      } else {
        // Silently fail - server returned non-OK status
        setHasError(true);
        if (isLoading) {
          setTeamMembers([]);
        }
      }
    } catch (error) {
      // Silently fail if server is offline (TypeError: Failed to fetch)
      if (!(error instanceof TypeError && error.message.includes('fetch'))) {
        // Log non-network errors only
        console.error('[TEAM PERFORMANCE] Unexpected error:', error);
      }
      setHasError(true);
      if (isLoading) {
        setTeamMembers([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for safe division (prevents NaN)
  const safeDivide = (numerator: number, denominator: number): number => {
    if (!denominator || denominator === 0) return 0;
    return Math.round(numerator / denominator);
  };

  const safePercentage = (numerator: number, denominator: number): number => {
    if (!denominator || denominator === 0) return 0;
    return Math.round((numerator / denominator) * 100);
  };

  // Calculate team statistics
  const totalTarget = teamMembers.reduce((sum, m) => sum + m.dailyTarget, 0);
  const totalCallsToday = teamMembers.reduce((sum, m) => sum + m.callsToday, 0);
  const totalCallsWeek = teamMembers.reduce((sum, m) => sum + m.callsWeek, 0);
  const totalCallsMonth = teamMembers.reduce((sum, m) => sum + m.callsMonth, 0);
  const teamProgress = safePercentage(totalCallsToday, totalTarget);
  const activeAgents = teamMembers.filter(m => m.status === 'active').length;
  const onTargetCount = teamMembers.filter(m => m.callsToday >= m.dailyTarget).length;

  const getProgressColor = (calls: number, target: number) => {
    const percentage = safePercentage(calls, target);
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Calculate board-specific totals
  const totalClientCalls = teamMembers.reduce((sum, m) => sum + m.clientCalls, 0);
  const totalPromoSales = teamMembers.reduce((sum, m) => sum + m.promoSales, 0);
  const totalCustomerService = teamMembers.reduce((sum, m) => sum + m.customerService, 0);
  const totalEmailsSent = teamMembers.reduce((sum, m) => sum + m.emailsSent, 0);
  const totalDealsCreated = teamMembers.reduce((sum, m) => sum + m.dealsCreated, 0);
  const totalTicketsResolved = teamMembers.reduce((sum, m) => sum + m.ticketsResolved, 0);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'this-week': return 'This Week';
      case 'last-week': return 'Last Week';
      case 'this-month': return 'This Month';
      case 'last-month': return 'Last Month';
      case 'custom': 
        if (customStartDate && customEndDate) {
          return `${customStartDate.toLocaleDateString()} - ${customEndDate.toLocaleDateString()}`;
        }
        return 'Custom Period';
      default: return 'Today';
    }
  };

  const getPeriodDateRange = () => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (selectedPeriod) {
      case 'today':
        startDate = today;
        endDate = today;
        break;
      case 'yesterday':
        startDate = new Date(today.setDate(today.getDate() - 1));
        endDate = startDate;
        break;
      case 'this-week':
        const firstDayOfWeek = today.getDate() - today.getDay();
        startDate = new Date(today.setDate(firstDayOfWeek));
        endDate = new Date();
        break;
      case 'last-week':
        const lastWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 7));
        const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1));
        startDate = lastWeekStart;
        endDate = lastWeekEnd;
        break;
      case 'this-month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case 'last-month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = customStartDate;
          endDate = customEndDate;
        }
        break;
    }

    return { startDate, endDate };
  };

  const handleGenerateTeamReport = () => {
    setIsPeriodSelectorOpen(true);
  };

  const handleProceedToReport = () => {
    if (selectedPeriod === 'custom' && (!customStartDate || !customEndDate)) {
      toast.error("Please select both start and end dates for custom period");
      return;
    }
    setIsPeriodSelectorOpen(false);
    setIsReportDialogOpen(true);
  };

  const handleDownloadReport = () => {
    const today = new Date().toLocaleDateString();
    const { startDate, endDate } = getPeriodDateRange();
    const reportContent = `
BTM Travel - Team Performance Report
Generated: ${today}
Report Period: ${getPeriodLabel()}
Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}
Manager: ${currentUser?.name || 'Manager'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERALL TEAM SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Daily Target: ${totalTarget} calls
Calls Completed Today: ${totalCallsToday} calls (${teamProgress}%)
Team Members: ${teamMembers.length}
Active Agents: ${activeAgents}
Agents On Target: ${onTargetCount}/${teamMembers.length}

BREAKDOWN BY BOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 Client CRM: ${totalClientCalls} calls
🛍️ Promo Sales: ${totalPromoSales} deals
🎧 Customer Service: ${totalCustomerService} tickets

ADDITIONAL METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Emails Sent: ${totalEmailsSent}
💼 Deals Created: ${totalDealsCreated}
✅ Tickets Resolved: ${totalTicketsResolved}

INDIVIDUAL AGENT PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${teamMembers.map((agent, index) => `
${index + 1}. ${agent.name}
   Status: ${agent.status.toUpperCase()}
   Target: ${agent.dailyTarget} | Completed: ${agent.callsToday} (${Math.round((agent.callsToday / agent.dailyTarget) * 100)}%)
   
   Board Breakdown:
   • Client CRM: ${agent.clientCalls} calls
   • Promo Sales: ${agent.promoSales} deals
   • Customer Service: ${agent.customerService} tickets
   
   Additional:
   • Emails: ${agent.emailsSent}
   • Deals Created: ${agent.dealsCreated}
   • Tickets Resolved: ${agent.ticketsResolved}
   
   Last Activity: ${agent.lastCallTime || 'No recent activity'}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Report generated by BTM Travel CRM System
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Team report downloaded successfully!");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-muted-foreground">Loading team performance data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Error Alert */}
      {hasError && teamMembers.length > 0 && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Connection Warning:</strong> Unable to refresh data from server. Showing last loaded data. 
            <Button 
              onClick={() => fetchTeamPerformance(true)}
              variant="link"
              className="text-orange-600 underline ml-2 p-0 h-auto"
            >
              Try refreshing
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team Performance Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor your team's call activity and performance across all channels</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => fetchTeamPerformance(true)}
            variant="outline"
            className="bg-white/60 backdrop-blur-xl border-white/20"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button 
            onClick={handleGenerateTeamReport}
            className="bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/20"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Team Report
          </Button>
        </div>
      </div>

      {/* Performance Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-xl border border-white/20 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="client-crm" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Client CRM
          </TabsTrigger>
          <TabsTrigger value="promo-sales" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Promo Sales
          </TabsTrigger>
          <TabsTrigger value="customer-service" className="flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            Customer Service
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">

      {teamMembers.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-xl border-white/20">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              {hasError ? (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-700">Server Connection Failed</h3>
                    <p className="text-gray-600 mt-2">
                      Cannot connect to the backend server. This usually means the Supabase Edge Function needs to be deployed.
                    </p>
                    <Alert className="mt-4 text-left bg-red-50 border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <p className="font-semibold mb-2">To fix this issue:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                          <li>Go to your <a href={`https://supabase.com/dashboard/project/${projectId}/functions`} target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard → Edge Functions</a></li>
                          <li>Deploy or redeploy the <code className="bg-red-100 px-1 rounded">make-server-8fff4b3c</code> function</li>
                          <li>Wait 1-2 minutes for deployment to complete</li>
                          <li>Click "Try Again" below</li>
                        </ol>
                        <p className="text-xs mt-2 text-red-600">
                          See <code className="bg-red-100 px-1 rounded">/DEPLOYMENT_REQUIRED.md</code> for detailed instructions
                        </p>
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2 justify-center mt-4">
                      <Button 
                        onClick={() => fetchTeamPerformance(true)}
                        className="bg-gradient-to-br from-violet-600 to-purple-600 text-white"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Button 
                        variant="outline"
                        asChild
                      >
                        <a href={`https://supabase.com/dashboard/project/${projectId}/functions`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Supabase
                        </a>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Users className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">No Team Members Found</h3>
                    <p className="text-gray-500 mt-2">
                      There are no agents in the system yet. Add team members in the Admin Settings to see their performance here.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Team Daily Target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{totalTarget}</div>
            <p className="text-sm text-muted-foreground mt-1">calls expected today</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Calls Completed Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalCallsToday}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {teamProgress}% of target
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Agents On Target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {onTargetCount}/{teamMembers.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              meeting daily goals
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-white/20">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Active Agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {activeAgents}/{teamMembers.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">currently calling</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly & Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="w-5 h-5" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700">{totalCallsWeek}</div>
            <p className="text-blue-800 mt-2">Total team calls this week</p>
            <p className="text-sm text-blue-600 mt-1">
              Avg: {safeDivide(totalCallsWeek, teamMembers.length)} per agent
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Calendar className="w-5 h-5" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-700">{totalCallsMonth}</div>
            <p className="text-purple-800 mt-2">Total team calls this month</p>
            <p className="text-sm text-purple-600 mt-1">
              Avg: {safeDivide(totalCallsMonth, teamMembers.length)} per agent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Performance */}
      <Card className="bg-white/60 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Individual Agent Performance
          </CardTitle>
          <CardDescription>Real-time view of each team member's progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => {
              const progress = Math.round((member.callsToday / member.dailyTarget) * 100);
              const isOnTarget = member.callsToday >= member.dailyTarget;
              
              return (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)} absolute -top-1 -right-1 border-2 border-white`} />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{member.name}</h4>
                        <Badge variant="outline" className="text-xs">Agent</Badge>
                        {isOnTarget && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            On Target
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Last activity: {member.lastCallTime || 'No recent calls'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Today's Progress */}
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Today</div>
                      <div className={`text-2xl font-bold ${getProgressColor(member.callsToday, member.dailyTarget)}`}>
                        {member.callsToday}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        of {member.dailyTarget} ({progress}%)
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full ${isOnTarget ? 'bg-green-500' : 'bg-blue-500'} transition-all`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Week */}
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Week</div>
                      <div className="text-xl font-semibold text-blue-600">
                        {member.callsWeek}
                      </div>
                    </div>

                    {/* Month */}
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Month</div>
                      <div className="text-xl font-semibold text-purple-600">
                        {member.callsMonth}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Team Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">
                {onTargetCount} agents have met or exceeded their daily targets
              </p>
              <p className="text-sm text-green-700 mt-1">
                {safePercentage(onTargetCount, teamMembers.length)}% of the team is on track for today's goals
              </p>
            </div>
          </div>

          {activeAgents > 0 && (
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">
                  {activeAgents} agents currently making calls
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Strong team activity - keep up the momentum!
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">
                Team is at {teamProgress}% of combined daily target
              </p>
              <p className="text-sm text-green-700 mt-1">
                {totalCallsToday} calls completed, {totalTarget - totalCallsToday} remaining
              </p>
            </div>
          </div>

          {teamMembers.filter(m => m.callsToday < m.dailyTarget * 0.5).length > 0 && (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">
                  {teamMembers.filter(m => m.callsToday < m.dailyTarget * 0.5).length} agents below 50% of target
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Consider reaching out to provide support or check for blockers
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
        </TabsContent>

        {/* Client CRM Tab */}
        <TabsContent value="client-crm" className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Phone className="w-5 h-5" />
                Client CRM Performance
              </CardTitle>
              <CardDescription>Prospective client outreach and call activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Client Calls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{totalClientCalls}</div>
                    <p className="text-xs text-muted-foreground mt-1">prospective clients contacted</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Active Agents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {teamMembers.filter(m => m.clientCalls > 0).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">making client calls today</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg per Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {safeDivide(totalClientCalls, teamMembers.length)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">calls per agent</p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Client Calls</TableHead>
                    <TableHead className="text-right">Daily Target</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            agent.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : agent.status === 'idle'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{agent.clientCalls}</TableCell>
                      <TableCell className="text-right">{agent.dailyTarget}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={agent.clientCalls >= agent.dailyTarget ? 'text-green-600' : 'text-orange-600'}>
                            {safePercentage(agent.clientCalls, agent.dailyTarget)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promo Sales Tab */}
        <TabsContent value="promo-sales" className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <ShoppingBag className="w-5 h-5" />
                Promo Sales Performance
              </CardTitle>
              <CardDescription>Promotional campaigns and sales activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Promo Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{totalPromoSales}</div>
                    <p className="text-xs text-muted-foreground mt-1">promotional deals</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Active Agents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {teamMembers.filter(m => m.promoSales > 0).length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">making promo sales today</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg per Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {safeDivide(totalPromoSales, teamMembers.length)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">deals per agent</p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Promo Sales</TableHead>
                    <TableHead className="text-right">Deals Created</TableHead>
                    <TableHead className="text-right">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            agent.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : agent.status === 'idle'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{agent.promoSales}</TableCell>
                      <TableCell className="text-right">{agent.dealsCreated}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {agent.lastCallTime || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Service Tab */}
        <TabsContent value="customer-service" className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Headphones className="w-5 h-5" />
                Customer Service Performance
              </CardTitle>
              <CardDescription>Support tickets and customer service activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Support Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{totalCustomerService}</div>
                    <p className="text-xs text-muted-foreground mt-1">customer inquiries handled</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tickets Resolved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{totalTicketsResolved}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {safePercentage(totalTicketsResolved, totalCustomerService)}% resolution rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Avg per Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {safeDivide(totalCustomerService, teamMembers.length)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">tickets per agent</p>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Support Tickets</TableHead>
                    <TableHead className="text-right">Resolved</TableHead>
                    <TableHead className="text-right">Resolution Rate</TableHead>
                    <TableHead className="text-right">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            agent.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : agent.status === 'idle'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{agent.customerService}</TableCell>
                      <TableCell className="text-right">{agent.ticketsResolved}</TableCell>
                      <TableCell className="text-right">
                        <span className={agent.customerService > 0 && agent.ticketsResolved >= agent.customerService * 0.8 ? 'text-green-600 font-semibold' : ''}>
                          {safePercentage(agent.ticketsResolved, agent.customerService)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {agent.lastCallTime || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Period Selector Dialog */}
      <Dialog open={isPeriodSelectorOpen} onOpenChange={setIsPeriodSelectorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CalendarDays className="w-6 h-6 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Select Report Period
              </span>
            </DialogTitle>
            <DialogDescription>
              Choose the time period for your team performance report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Quick Period Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Quick Select
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Today */}
                <div 
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedPeriod === 'today' 
                      ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-200' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                  onClick={() => setSelectedPeriod('today')}
                >
                  <div className="font-semibold">Today</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date().toLocaleDateString()}</div>
                  {selectedPeriod === 'today' && (
                    <CheckCircle className="w-5 h-5 text-purple-600 absolute top-3 right-3" />
                  )}
                </div>

                {/* Yesterday */}
                <div 
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedPeriod === 'yesterday' 
                      ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-200' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                  onClick={() => setSelectedPeriod('yesterday')}
                >
                  <div className="font-semibold">Yesterday</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()}
                  </div>
                  {selectedPeriod === 'yesterday' && (
                    <CheckCircle className="w-5 h-5 text-purple-600 absolute top-3 right-3" />
                  )}
                </div>

                {/* This Week */}
                <div 
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedPeriod === 'this-week' 
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  onClick={() => setSelectedPeriod('this-week')}
                >
                  <div className="font-semibold">This Week</div>
                  <div className="text-xs text-muted-foreground mt-1">Sun - Today</div>
                  {selectedPeriod === 'this-week' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 absolute top-3 right-3" />
                  )}
                </div>

                {/* Last Week */}
                <div 
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedPeriod === 'last-week' 
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  onClick={() => setSelectedPeriod('last-week')}
                >
                  <div className="font-semibold">Last Week</div>
                  <div className="text-xs text-muted-foreground mt-1">Previous 7 days</div>
                  {selectedPeriod === 'last-week' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 absolute top-3 right-3" />
                  )}
                </div>

                {/* This Month */}
                <div 
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedPeriod === 'this-month' 
                      ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                  onClick={() => setSelectedPeriod('this-month')}
                >
                  <div className="font-semibold">This Month</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleString('default', { month: 'long' })}
                  </div>
                  {selectedPeriod === 'this-month' && (
                    <CheckCircle className="w-5 h-5 text-green-600 absolute top-3 right-3" />
                  )}
                </div>

                {/* Last Month */}
                <div 
                  className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    selectedPeriod === 'last-month' 
                      ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                  onClick={() => setSelectedPeriod('last-month')}
                >
                  <div className="font-semibold">Last Month</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'long' })}
                  </div>
                  {selectedPeriod === 'last-month' && (
                    <CheckCircle className="w-5 h-5 text-green-600 absolute top-3 right-3" />
                  )}
                </div>
              </div>
            </div>

            {/* Custom Period */}
            <div className="space-y-4 pt-4 border-t">
              <div 
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  selectedPeriod === 'custom' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-200' 
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
                onClick={() => setSelectedPeriod('custom')}
              >
                <div className="font-semibold flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Custom Date Range
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedPeriod === 'custom' && customStartDate && customEndDate
                    ? `${customStartDate.toLocaleDateString()} - ${customEndDate.toLocaleDateString()}`
                    : 'Choose your own dates'}
                </div>
                {selectedPeriod === 'custom' && (
                  <CheckCircle className="w-5 h-5 text-orange-600 absolute top-3 right-3" />
                )}
              </div>

              {selectedPeriod === 'custom' && (
                <div className="grid grid-cols-2 gap-4 pl-10 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !customStartDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {customStartDate ? customStartDate.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={customStartDate}
                          onSelect={setCustomStartDate}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !customEndDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {customEndDate ? customEndDate.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={customEndDate}
                          onSelect={setCustomEndDate}
                          disabled={(date) => date > new Date() || (customStartDate ? date < customStartDate : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Period Preview */}
            <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Selected Period</p>
                    <p className="font-semibold text-lg">{getPeriodLabel()}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Date Range</p>
                    <p className="text-sm font-medium">
                      {(() => {
                        const { startDate, endDate } = getPeriodDateRange();
                        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                      })()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsPeriodSelectorOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProceedToReport}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
            >
              Generate Report
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Team Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Team Performance Report - {getPeriodLabel()}
            </DialogTitle>
            <DialogDescription>
              Complete breakdown across all boards and metrics • {(() => {
                const { startDate, endDate } = getPeriodDateRange();
                return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
              })()}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="byboard">By Board</TabsTrigger>
              <TabsTrigger value="individuals">Individuals</TabsTrigger>
              <TabsTrigger value="metrics">All Metrics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Target</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{totalTarget}</div>
                    <p className="text-xs text-muted-foreground mt-1">calls expected</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{totalCallsToday}</div>
                    <p className="text-xs text-muted-foreground mt-1">{teamProgress}% of target</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">On Target</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{onTargetCount}/{teamMembers.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">agents meeting goals</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle>Team Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Agents</span>
                      <Badge className="bg-green-600">{activeAgents}/{teamMembers.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Week Total</span>
                      <span className="font-semibold">{totalCallsWeek} calls</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month Total</span>
                      <span className="font-semibold">{totalCallsMonth} calls</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average per Agent (Month)</span>
                      <span className="font-semibold">{Math.round(totalCallsMonth / teamMembers.length)} calls</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-900">
                      <Headphones className="w-5 h-5" />
                      Customer Service Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-teal-800">Total Tickets</span>
                      <span className="font-semibold text-teal-900">{totalCustomerService}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-teal-800">Resolved</span>
                      <Badge className="bg-green-600">{totalTicketsResolved}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-teal-800">Resolution Rate</span>
                      <Badge className="bg-teal-600">
                        {totalCustomerService > 0 ? Math.round((totalTicketsResolved / totalCustomerService) * 100) : 0}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-teal-800">Avg per Agent</span>
                      <span className="font-semibold text-teal-900">{Math.round(totalCustomerService / teamMembers.length)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* By Board Tab */}
            <TabsContent value="byboard" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-900">
                      <Phone className="w-5 h-5" />
                      Client CRM
                    </CardTitle>
                    <CardDescription>Daily call activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-violet-700 mb-2">{totalClientCalls}</div>
                    <p className="text-sm text-violet-800">Total calls today</p>
                    <div className="mt-4 space-y-1">
                      {teamMembers.map(agent => (
                        <div key={agent.id} className="flex justify-between text-sm">
                          <span className="text-violet-700">{agent.name.split(' ')[0]}</span>
                          <span className="font-semibold text-violet-900">{agent.clientCalls}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <ShoppingBag className="w-5 h-5" />
                      Promo Sales
                    </CardTitle>
                    <CardDescription>Deals & promotions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-orange-700 mb-2">{totalPromoSales}</div>
                    <p className="text-sm text-orange-800">Deals created today</p>
                    <div className="mt-4 space-y-1">
                      {teamMembers.map(agent => (
                        <div key={agent.id} className="flex justify-between text-sm">
                          <span className="text-orange-700">{agent.name.split(' ')[0]}</span>
                          <span className="font-semibold text-orange-900">{agent.promoSales}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-900">
                      <Headphones className="w-5 h-5" />
                      Customer Service
                    </CardTitle>
                    <CardDescription>Support tickets & resolution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-teal-700 mb-2">{totalCustomerService}</div>
                    <p className="text-sm text-teal-800">Total tickets handled</p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-700">{totalTicketsResolved} resolved</span>
                      <span className="text-teal-600">
                        ({totalCustomerService > 0 ? Math.round((totalTicketsResolved / totalCustomerService) * 100) : 0}% rate)
                      </span>
                    </div>
                    <div className="mt-4 space-y-1">
                      {teamMembers.map(agent => (
                        <div key={agent.id} className="flex justify-between text-sm">
                          <span className="text-teal-700">{agent.name.split(' ')[0]}</span>
                          <span className="font-semibold text-teal-900">{agent.customerService} <span className="text-xs text-teal-600">({agent.ticketsResolved} ✓)</span></span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Board Distribution Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-violet-500 rounded"></div>
                          Client CRM
                        </span>
                        <span className="font-semibold">{totalClientCalls} ({Math.round((totalClientCalls / totalCallsToday) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full"
                          style={{ width: `${(totalClientCalls / totalCallsToday) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded"></div>
                          Promo Sales
                        </span>
                        <span className="font-semibold">{totalPromoSales} ({Math.round((totalPromoSales / totalCallsToday) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full"
                          style={{ width: `${(totalPromoSales / totalCallsToday) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-teal-500 rounded"></div>
                          Customer Service
                        </span>
                        <span className="font-semibold">{totalCustomerService} ({Math.round((totalCustomerService / totalCallsToday) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full"
                          style={{ width: `${(totalCustomerService / totalCallsToday) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Individuals Tab */}
            <TabsContent value="individuals" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead className="text-right">Today</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                    <TableHead className="text-right">Week</TableHead>
                    <TableHead className="text-right">Month</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((agent) => {
                    const progress = Math.round((agent.callsToday / agent.dailyTarget) * 100);
                    return (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{agent.dailyTarget}</TableCell>
                        <TableCell className="text-right font-semibold">{agent.callsToday}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={progress >= 100 ? 'default' : 'secondary'} className={progress >= 100 ? 'bg-green-600' : ''}>
                            {progress}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{agent.callsWeek}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{agent.callsMonth}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-gray-50 font-semibold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">{totalTarget}</TableCell>
                    <TableCell className="text-right">{totalCallsToday}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-purple-600">{teamProgress}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">{totalCallsWeek}</TableCell>
                    <TableCell className="text-right">{totalCallsMonth}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* All Metrics Tab */}
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Emails Sent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{totalEmailsSent}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Deals Created
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{totalDealsCreated}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Tickets Resolved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{totalTicketsResolved}</div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Client CRM</TableHead>
                    <TableHead className="text-right">Promo Sales</TableHead>
                    <TableHead className="text-right">Support</TableHead>
                    <TableHead className="text-right">Emails</TableHead>
                    <TableHead className="text-right">Deals</TableHead>
                    <TableHead className="text-right">Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="text-right">{agent.clientCalls}</TableCell>
                      <TableCell className="text-right">{agent.promoSales}</TableCell>
                      <TableCell className="text-right">{agent.customerService}</TableCell>
                      <TableCell className="text-right">{agent.emailsSent}</TableCell>
                      <TableCell className="text-right">{agent.dealsCreated}</TableCell>
                      <TableCell className="text-right">{agent.ticketsResolved}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-semibold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">{totalClientCalls}</TableCell>
                    <TableCell className="text-right">{totalPromoSales}</TableCell>
                    <TableCell className="text-right">{totalCustomerService}</TableCell>
                    <TableCell className="text-right">{totalEmailsSent}</TableCell>
                    <TableCell className="text-right">{totalDealsCreated}</TableCell>
                    <TableCell className="text-right">{totalTicketsResolved}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleDownloadReport}
              className="bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
