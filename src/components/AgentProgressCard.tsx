import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { TrendingUp, Phone, Star, HeadphonesIcon } from "lucide-react";
import { backendService } from "../utils/backendService";
import { useUser } from "./UserContext";

interface ProgressStats {
  clientCRM: {
    total: number;
    completed: number;
    pending: number;
  };
  specialNumbers: {
    total: number;
    completed: number;
    pending: number;
  };
  customerService: {
    total: number;
    completed: number;
    pending: number;
  };
  overall: {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  };
}

export function AgentProgressCard() {
  const { currentUser } = useUser();
  const [stats, setStats] = useState<ProgressStats>({
    clientCRM: { total: 0, completed: 0, pending: 0 },
    specialNumbers: { total: 0, completed: 0, pending: 0 },
    customerService: { total: 0, completed: 0, pending: 0 },
    overall: { total: 0, completed: 0, pending: 0, percentage: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadProgress, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const loadProgress = async () => {
    if (!currentUser) return;

    try {
      const data = await backendService.getAssignments(currentUser.id);
      
      // Filter and count assignments by type - IMPORTANT: Keep types separate!
      const clientAssignments = (data.assignments || []).filter((a: any) => a.type === 'client');
      const specialAssignments = (data.assignments || []).filter((a: any) => a.type === 'special');
      const customerAssignments = (data.assignments || []).filter((a: any) => a.type === 'customer');
      
      const clientCRM = {
        total: clientAssignments.length,
        completed: clientAssignments.filter((a: any) => a.called).length,
        pending: clientAssignments.filter((a: any) => !a.called).length
      };
      
      const specialNumbers = {
        total: specialAssignments.length,
        completed: specialAssignments.filter((a: any) => a.called).length,
        pending: specialAssignments.filter((a: any) => !a.called).length
      };

      const customerService = {
        total: customerAssignments.length,
        completed: customerAssignments.filter((a: any) => a.called).length,
        pending: customerAssignments.filter((a: any) => !a.called).length
      };
      
      const overall = {
        total: clientCRM.total + specialNumbers.total + customerService.total,
        completed: clientCRM.completed + specialNumbers.completed + customerService.completed,
        pending: clientCRM.pending + specialNumbers.pending + customerService.pending,
        percentage: (clientCRM.total + specialNumbers.total + customerService.total) > 0 
          ? Math.round(((clientCRM.completed + specialNumbers.completed + customerService.completed) / (clientCRM.total + specialNumbers.total + customerService.total)) * 100)
          : 0
      };

      setStats({ clientCRM, specialNumbers, customerService, overall });
    } catch (error) {
      console.error('[AGENT PROGRESS] Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  // Get initials for avatar
  const getInitials = () => {
    const names = currentUser.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-100 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <Avatar className="w-16 h-16 border-4 border-purple-200 shadow-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <AvatarFallback className="text-white text-xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* User Info and Stats */}
          <div className="flex-1 space-y-4">
            {/* User Name and Email */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
              <p className="text-sm text-gray-600">{currentUser.email}</p>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Overall Progress
                </span>
                <span className="text-purple-700 font-bold">{stats.overall.percentage}%</span>
              </div>
              <div className="relative h-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.overall.percentage}%` }}
                />
              </div>
            </div>

            {/* Stats Grid - 3 columns for all three types */}
            <div className="grid grid-cols-3 gap-4">
              {/* Client CRM */}
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-sm font-semibold text-blue-700">Client CRM</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600/70">Total:</span>
                    <span className="text-blue-900 font-semibold">{stats.clientCRM.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600/70">Completed:</span>
                    <span className="text-green-700 font-semibold">{stats.clientCRM.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600/70">Pending:</span>
                    <span className="text-orange-700 font-semibold">{stats.clientCRM.pending}</span>
                  </div>
                </div>
              </div>

              {/* Special Numbers - NEW SEPARATE BOX */}
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span className="text-sm font-semibold text-purple-700">Special Numbers</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600/70">Total:</span>
                    <span className="text-purple-900 font-semibold">{stats.specialNumbers.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600/70">Completed:</span>
                    <span className="text-green-700 font-semibold">{stats.specialNumbers.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600/70">Pending:</span>
                    <span className="text-orange-700 font-semibold">{stats.specialNumbers.pending}</span>
                  </div>
                </div>
              </div>

              {/* Customer Service */}
              <div className="bg-pink-50 p-4 rounded-lg border-2 border-pink-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-pink-600"></div>
                  <span className="text-sm font-semibold text-pink-700">Customer Service</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600/70">Total:</span>
                    <span className="text-pink-900 font-semibold">{stats.customerService.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600/70">Completed:</span>
                    <span className="text-green-700 font-semibold">{stats.customerService.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-pink-600/70">Pending:</span>
                    <span className="text-orange-700 font-semibold">{stats.customerService.pending}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
