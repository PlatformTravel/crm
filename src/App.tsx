import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ClientCRM } from "./components/ClientCRM";
import { PromoSales } from "./components/PromoSales";
import { CustomerService } from "./components/CustomerService";
import { AdminSettings } from "./components/AdminSettings";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { DatabaseManager } from "./components/DatabaseManager";
import { NumberBankManager } from "./components/NumberBankManager";
import { ArchiveManager } from "./components/ArchiveManager";
import { Help } from "./components/Help";
import { Toaster } from "./components/ui/sonner";
import { Phone, Tag, HeadphonesIcon, Sparkles, Settings, LogOut, User, BookOpen, Database, Users as UsersIcon, Archive } from "lucide-react";
import { BTMTravelLogo } from "./components/BTMTravelLogo";
import { UserProvider, useUser } from "./components/UserContext";
import { ThreeCXProvider, useThreeCX } from "./components/ThreeCXContext";
import { ActiveCallPanel } from "./components/ActiveCallPanel";
import { Login } from "./components/Login";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { ServerHealthCheck } from "./components/ServerHealthCheck";
import { DeploymentRequired } from "./components/DeploymentRequired";
import { DemoModeBanner } from "./components/DemoModeBanner";
import { useEffect } from "react";
import { BACKEND_URL } from "./utils/config";

function AppContent() {
  const { currentUser, logout, isAdmin } = useUser();
  const { config } = useThreeCX();
  const [showHelp, setShowHelp] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(true);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const isManager = currentUser?.role === 'manager';

  // Check server status on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/health`,
          {
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000) // 5 second timeout
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'ok') {
            setServerStatus('online');
            console.log('%c✅ Backend Connected ', 'background: #22c55e; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;');
            return;
          }
        }
        setServerStatus('offline');
      } catch (error) {
        // Backend offline - enter demo mode silently
        setServerStatus('offline');
      }
    };
    
    checkServer();
  }, []);

  // Demo mode activates automatically if server is offline
  // A banner will show with instructions to start the backend

  // Show login page if not logged in
  if (!currentUser) {
    return <Login />;
  }

  // Show Help page if requested
  if (showHelp) {
    return <Help onBack={() => setShowHelp(false)} />;
  }

  // Admins see the Admin Settings panel directly
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" style={{
        backgroundImage: 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #e9d5ff)',
        WebkitBackgroundClip: 'padding-box',
        backgroundClip: 'padding-box'
      }}>
        {/* Header with gradient */}
        <div className="relative overflow-hidden border-b-2 border-white/30 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600" style={{
          backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #3b82f6 100%)',
          WebkitBackgroundClip: 'padding-box',
          backgroundClip: 'padding-box'
        }}>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-30 animate-pulse" style={{
            backgroundImage: 'linear-gradient(to right, rgba(124, 58, 237, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))'
          }} />
          
          {/* Decorative circles */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2" style={{
            filter: 'blur(80px)',
            WebkitFilter: 'blur(80px)'
          }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-300/20 rounded-full translate-y-1/2" style={{
            filter: 'blur(80px)',
            WebkitFilter: 'blur(80px)'
          }} />
          
          <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 relative">
            <div className="space-y-4">
              {/* Top Row - Logo and User Info */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform">
                      <BTMTravelLogo className="w-20 h-20 sm:w-32 sm:h-32" />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-white drop-shadow-lg text-xl sm:text-4xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>
                      BTMTravel CRM
                    </h1>
                    <p className="text-white/90 flex items-center gap-2 text-sm sm:text-lg" style={{ fontWeight: '500' }}>
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Admin Portal - System Management</span>
                      <span className="sm:hidden">Admin Portal</span>
                    </p>
                  </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-xl rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 border border-white/20">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <div className="text-right">
                        <div className="text-white font-semibold text-xs sm:text-base">{currentUser.name}</div>
                        <div className="text-white/70 text-xs flex items-center gap-1 sm:gap-2">
                          <Badge variant="secondary" className="text-xs px-1 sm:px-2">
                            ADMIN
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </div>

              {/* Bottom Row - Help Button */}
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowHelp(true)}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:text-white text-sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Help & Documentation</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-10">
          {/* Demo Mode Banner - Shows when backend is offline */}
          {serverStatus === 'offline' && (
            <div className="mb-6">
              <DemoModeBanner />
            </div>
          )}
          
          {/* Server Health Check */}
          {showHealthCheck && serverStatus === 'online' && (
            <div className="mb-6">
              <ServerHealthCheck onDismiss={() => setShowHealthCheck(false)} />
            </div>
          )}
          
          {/* Admin Settings - No Tabs, Just Direct Access */}
          <AdminSettings />
        </div>

        <Toaster />
      </div>
    );
  }

  // Managers see the Team Performance Dashboard directly
  if (isManager) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" style={{
        backgroundImage: 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #e9d5ff)',
        WebkitBackgroundClip: 'padding-box',
        backgroundClip: 'padding-box'
      }}>
        {/* Header with gradient */}
        <div className="relative overflow-hidden border-b-2 border-white/30 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600" style={{
          backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #3b82f6 100%)',
          WebkitBackgroundClip: 'padding-box',
          backgroundClip: 'padding-box'
        }}>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-30 animate-pulse" style={{
            backgroundImage: 'linear-gradient(to right, rgba(124, 58, 237, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))'
          }} />
          
          {/* Decorative circles */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2" style={{
            filter: 'blur(80px)',
            WebkitFilter: 'blur(80px)'
          }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-300/20 rounded-full translate-y-1/2" style={{
            filter: 'blur(80px)',
            WebkitFilter: 'blur(80px)'
          }} />
          
          <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 relative">
            <div className="space-y-4">
              {/* Top Row - Logo and User Info */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform">
                      <BTMTravelLogo className="w-20 h-20 sm:w-32 sm:h-32" />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-white drop-shadow-lg text-xl sm:text-4xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>
                      BTMTravel CRM
                    </h1>
                    <p className="text-white/90 flex items-center gap-2 text-sm sm:text-lg" style={{ fontWeight: '500' }}>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Client Management & Sales Operations</span>
                      <span className="sm:hidden">CRM Platform</span>
                    </p>
                  </div>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* 3CX Status Indicator */}
                  {config.enabled && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-lg px-2 sm:px-3 py-2 border border-white/20 hidden md:flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <Phone className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-medium">3CX Active</span>
                    </div>
                  )}
                  
                  <div className="bg-white/10 backdrop-blur-xl rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 border border-white/20">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <div className="text-right">
                        <div className="text-white font-semibold text-xs sm:text-base">{currentUser.name}</div>
                        <div className="text-white/70 text-xs flex items-center gap-1 sm:gap-2">
                          <Badge variant="secondary" className="text-xs px-1 sm:px-2">
                            {currentUser.role.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </div>

              {/* Bottom Row - Help Button */}
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowHelp(true)}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:text-white text-sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Help & Documentation</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-10">
          {/* Demo Mode Banner - Shows when backend is offline */}
          {serverStatus === 'offline' && (
            <div className="mb-6">
              <DemoModeBanner />
            </div>
          )}
          
          {/* Server Health Check */}
          {showHealthCheck && serverStatus === 'online' && (
            <div className="mb-6">
              <ServerHealthCheck onDismiss={() => setShowHealthCheck(false)} />
            </div>
          )}
          
          {/* Manager Portal Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6 sm:space-y-8">
            <TabsList className="grid w-full grid-cols-4 sm:w-[800px] h-12 sm:h-14 p-1 sm:p-1.5 bg-white border-2 border-gray-200 shadow-xl rounded-lg sm:rounded-xl">
              <TabsTrigger 
                value="dashboard" 
                className="gap-1 sm:gap-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 transition-all duration-200 px-2 sm:px-4"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              >
                <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Team Dashboard</span>
                <span className="sm:hidden">Team</span>
              </TabsTrigger>
              <TabsTrigger 
                value="database" 
                className="gap-1 sm:gap-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 transition-all duration-200 px-2 sm:px-4"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Database</span>
                <span className="sm:hidden">Database</span>
              </TabsTrigger>
              <TabsTrigger 
                value="numberbank" 
                className="gap-1 sm:gap-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 transition-all duration-200 px-2 sm:px-4"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Number Bank</span>
                <span className="sm:hidden">Numbers</span>
              </TabsTrigger>
              <TabsTrigger 
                value="archive" 
                className="gap-1 sm:gap-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 transition-all duration-200 px-2 sm:px-4"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              >
                <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Archive</span>
                <span className="sm:hidden">Archive</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <ManagerDashboard />
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <DatabaseManager />
            </TabsContent>

            <TabsContent value="numberbank" className="space-y-6">
              <NumberBankManager />
            </TabsContent>

            <TabsContent value="archive" className="space-y-6">
              <ArchiveManager />
            </TabsContent>
          </Tabs>
        </div>

        <ActiveCallPanel />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" style={{
      backgroundImage: 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #e9d5ff)',
      WebkitBackgroundClip: 'padding-box',
      backgroundClip: 'padding-box'
    }}>
      {/* Header with gradient */}
      <div className="relative overflow-hidden border-b-2 border-white/30 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600" style={{
        backgroundImage: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 50%, #3b82f6 100%)',
        WebkitBackgroundClip: 'padding-box',
        backgroundClip: 'padding-box'
      }}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-30 animate-pulse" style={{
          backgroundImage: 'linear-gradient(to right, rgba(124, 58, 237, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))'
        }} />
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2" style={{
          filter: 'blur(80px)',
          WebkitFilter: 'blur(80px)'
        }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-300/20 rounded-full translate-y-1/2" style={{
          filter: 'blur(80px)',
          WebkitFilter: 'blur(80px)'
        }} />
        
        <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 relative">
          <div className="space-y-4">
            {/* Top Row - Logo and User Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="relative bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform">
                    <BTMTravelLogo className="w-20 h-20 sm:w-32 sm:h-32" />
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-white drop-shadow-lg text-xl sm:text-4xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>
                    BTMTravel CRM
                  </h1>
                  <p className="text-white/90 flex items-center gap-2 text-sm sm:text-lg" style={{ fontWeight: '500' }}>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Client Management & Sales Operations</span>
                    <span className="sm:hidden">CRM Platform</span>
                  </p>
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* 3CX Status Indicator */}
                {config.enabled && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-lg px-2 sm:px-3 py-2 border border-white/20 hidden md:flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <Phone className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-medium">3CX Active</span>
                  </div>
                )}
                
                <div className="bg-white/10 backdrop-blur-xl rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 border border-white/20">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <div className="text-right">
                      <div className="text-white font-semibold text-xs sm:text-base">{currentUser.name}</div>
                      <div className="text-white/70 text-xs flex items-center gap-1 sm:gap-2">
                        <Badge variant="secondary" className="text-xs px-1 sm:px-2">
                          {currentUser.role.toUpperCase()}
                        </Badge>
                        {currentUser.dailyTarget && (
                          <span className="hidden sm:inline text-xs">Target: {currentUser.dailyTarget}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:text-white text-xs sm:text-sm"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>

            {/* Bottom Row - Help Button (Visible to All) */}
            <div className="flex justify-end">
              <Button
                onClick={() => setShowHelp(true)}
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 hover:text-white text-sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Help & Documentation</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {/* Demo Mode Banner - Shows when backend is offline */}
        {serverStatus === 'offline' && (
          <div className="mb-6">
            <DemoModeBanner />
          </div>
        )}
        
        {/* Server Health Check */}
        {showHealthCheck && serverStatus === 'online' && (
          <div className="mb-6">
            <ServerHealthCheck onDismiss={() => setShowHealthCheck(false)} />
          </div>
        )}
        
        <Tabs defaultValue="client" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-3 sm:w-[600px] h-12 sm:h-14 p-1 sm:p-1.5 bg-white border-2 border-gray-200 shadow-xl rounded-lg sm:rounded-xl">
            <TabsTrigger 
              value="client" 
              className="gap-1 sm:gap-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 transition-all duration-200 px-2 sm:px-4"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Prospective Client</span>
              <span className="sm:hidden">Prospect</span>
            </TabsTrigger>
            <TabsTrigger 
              value="promo" 
              className="gap-1 sm:gap-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 transition-all duration-200 px-2 sm:px-4"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            >
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Promo Sales</span>
              <span className="sm:hidden">Promo</span>
            </TabsTrigger>
            <TabsTrigger 
              value="customer" 
              className="gap-1 sm:gap-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 transition-all duration-200 px-2 sm:px-4"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            >
              <HeadphonesIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Customer Service</span>
              <span className="sm:hidden">Service</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="space-y-6">
            <ClientCRM />
          </TabsContent>

          <TabsContent value="promo" className="space-y-6">
            <PromoSales />
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <CustomerService />
          </TabsContent>
        </Tabs>
      </div>

      <ActiveCallPanel />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ThreeCXProvider>
        <AppContent />
      </ThreeCXProvider>
    </UserProvider>
  );
}
