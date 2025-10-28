// Manager Dashboard Component
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
  Users, 
  Phone, 
  TrendingUp, 
  Activity,
  RefreshCw,
  AlertCircle,
  Target
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { backendService } from "../utils/backendService";

interface TeamMember {
  agentId: string;
  agentName: string;
  assigned: number;
  called: number;
  completionRate: number;
  status: 'active' | 'idle' | 'offline';
}

interface TeamSummary {
  totalAgents: number;
  totalAssigned: number;
  totalCalls: number;
  avgCompletionRate: number;
}

export function ManagerDashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamSummary, setTeamSummary] = useState<TeamSummary>({
    totalAgents: 0,
    totalAssigned: 0,
    totalCalls: 0,
    avgCompletionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamPerformance();
    
    const interval = setInterval(loadTeamPerformance, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadTeamPerformance = async () => {
    try {
      const response = await backendService.getTeamPerformance();
      if (response.success) {
        setTeamMembers(response.teamPerformance || []);
        setTeamSummary(response.summary || {
          totalAgents: 0,
          totalAssigned: 0,
          totalCalls: 0,
          avgCompletionRate: 0
        });
      }
    } catch (error) {
      console.error("Failed to load team performance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Team Performance Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Monitor your team's performance and progress</p>
        </div>
        <Button onClick={loadTeamPerformance} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Agents
            </CardDescription>
            <CardTitle className="text-3xl">{teamSummary.totalAgents}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Total Assigned
            </CardDescription>
            <CardTitle className="text-3xl">{teamSummary.totalAssigned}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Total Calls
            </CardDescription>
            <CardTitle className="text-3xl">{teamSummary.totalCalls}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg Completion
            </CardDescription>
            <CardTitle className="text-3xl">{teamSummary.avgCompletionRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members Performance</CardTitle>
          <CardDescription>Real-time agent performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading team data...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No team members found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Assigned</TableHead>
                  <TableHead className="text-right">Called</TableHead>
                  <TableHead className="text-right">Completion Rate</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.agentId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                        {member.agentName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{member.assigned}</TableCell>
                    <TableCell className="text-right">{member.called}</TableCell>
                    <TableCell className="text-right">{member.completionRate}%</TableCell>
                    <TableCell>
                      <Progress value={member.completionRate} className="w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
