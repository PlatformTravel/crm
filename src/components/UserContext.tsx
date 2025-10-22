import React, { createContext, useContext, useState, useEffect } from 'react';

export type Permission = 
  | 'view_team_performance'
  | 'view_all_agents'
  | 'manage_contacts'
  | 'manage_customers'
  | 'manage_promotions'
  | 'view_audit_logs'
  | 'generate_reports'
  | 'export_data'
  | 'assign_agents'
  | 'view_customer_details'
  | 'edit_customer_notes'
  | 'manage_promo_campaigns'
  | 'view_call_history'
  | 'export_call_history'
  | 'manage_call_scripts'
  | 'view_call_scripts'
  | 'configure_3cx'
  | 'make_calls'
  | 'view_own_calls'
  | 'configure_smtp'
  | 'manage_email_settings'
  | 'access_promo_sales'
  | 'view_promo_analytics'
  | 'access_customer_service'
  | 'manage_admin_settings'
  | 'view_archive'
  | 'manage_archive'
  | 'restore_archived_records';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  permissions?: Permission[]; // Flexible permissions for managers
  dailyTarget?: number; // User-specific target, if null uses global
  createdAt: string;
}

interface UserContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isManager: boolean;
  hasPermission: (permission: Permission) => boolean;
  dailyTarget: number;
  callsToday: number;
  incrementCallCount: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [globalTarget, setGlobalTarget] = useState(30);
  const [callsToday, setCallsToday] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string>('');

  // Check if we need to reset daily progress on mount and periodically
  useEffect(() => {
    checkAndResetDaily();
    
    // Check every minute for day change
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      if (lastResetDate && lastResetDate !== today) {
        console.log('[USER CONTEXT] Day changed, resetting progress');
        resetDailyProgress();
        checkAndResetDaily();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [lastResetDate]);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('btm_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Load daily progress from localStorage
    const savedCalls = localStorage.getItem('btm_calls_today');
    const savedDate = localStorage.getItem('btm_last_reset_date');
    
    if (savedCalls && savedDate) {
      const today = new Date().toISOString().split('T')[0];
      if (savedDate === today) {
        setCallsToday(parseInt(savedCalls));
        setLastResetDate(savedDate);
      } else {
        // Date changed, reset progress
        resetDailyProgress();
      }
    } else {
      setLastResetDate(new Date().toISOString().split('T')[0]);
    }
  }, []);

  const checkAndResetDaily = async () => {
    try {
      const response = await fetch(
        `https://${await import('../utils/supabase/info').then(m => m.projectId)}.supabase.co/functions/v1/make-server-8fff4b3c/daily-progress/check-reset`,
        {
          headers: {
            'Authorization': `Bearer ${await import('../utils/supabase/info').then(m => m.publicAnonKey)}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.wasReset) {
          console.log('[USER CONTEXT] Daily progress was auto-reset');
          resetDailyProgress();
        }
      }
    } catch (error) {
      // Silently fail - server sync is optional, daily reset is handled client-side
      // Only log if it's not a network error
      if (!(error instanceof TypeError && error.message.includes('fetch'))) {
        console.error('[USER CONTEXT] Error checking daily reset:', error);
      }
    }
  };

  const resetDailyProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    setCallsToday(0);
    setLastResetDate(today);
    localStorage.setItem('btm_calls_today', '0');
    localStorage.setItem('btm_last_reset_date', today);
  };

  const incrementCallCount = async () => {
    if (!currentUser) return;
    
    const newCount = callsToday + 1;
    setCallsToday(newCount);
    localStorage.setItem('btm_calls_today', newCount.toString());
    
    // Sync to backend (optional - silently fail if server is offline)
    try {
      await fetch(
        `https://${await import('../utils/supabase/info').then(m => m.projectId)}.supabase.co/functions/v1/make-server-8fff4b3c/daily-progress/${currentUser.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await import('../utils/supabase/info').then(m => m.publicAnonKey)}`
          },
          body: JSON.stringify({
            callsToday: newCount,
            lastCallTime: new Date().toISOString()
          })
        }
      );
    } catch (error) {
      // Silently fail - call count is tracked in localStorage
      // Only log non-network errors
      if (!(error instanceof TypeError && error.message.includes('fetch'))) {
        console.error('[USER CONTEXT] Error syncing call count:', error);
      }
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('[LOGIN] Attempting login for username:', username);
    
    // First, check users from localStorage (created via Admin panel)
    try {
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const parsed = JSON.parse(usersData);
        const users = parsed.users || [];
        console.log('[LOGIN] Checking against', users.length, 'users from localStorage');
        
        const user = users.find((u: any) => 
          u.username.toLowerCase() === username.toLowerCase()
        );
        
        if (user) {
          console.log('[LOGIN] Found user in localStorage:', user.username);
          // Check password (stored in localStorage with user data)
          if (user.password === password) {
            console.log('[LOGIN] Password match - logging in');
            setCurrentUser(user);
            localStorage.setItem('btm_current_user', JSON.stringify(user));
            
            // Log audit trail
            try {
              const auditLogs = JSON.parse(localStorage.getItem('loginAuditLogs') || '[]');
              auditLogs.push({
                id: Date.now().toString(),
                userId: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                timestamp: new Date().toISOString(),
                success: true,
                ipAddress: 'N/A'
              });
              localStorage.setItem('loginAuditLogs', JSON.stringify(auditLogs));
            } catch (e) {
              console.error('[LOGIN] Failed to log audit:', e);
            }
            
            return true;
          } else {
            console.log('[LOGIN] Password mismatch for user:', user.username);
          }
        }
      }
    } catch (error) {
      console.error('[LOGIN] Error checking localStorage users:', error);
    }
    
    // Fallback to demo users for backwards compatibility
    const demoUsers: { [key: string]: { password: string; user: User } } = {
      'admin': {
        password: 'admin123',
        user: {
          id: '1',
          username: 'admin',
          name: 'Admin User',
          email: 'admin@btmtravel.net',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      },
      'manager': {
        password: 'manager123',
        user: {
          id: '2',
          username: 'manager',
          name: 'Manager User',
          email: 'manager@btmtravel.net',
          role: 'manager',
          permissions: [
            'view_team_performance', 
            'view_all_agents', 
            'manage_contacts', 
            'manage_customers', 
            'view_customer_details', 
            'generate_reports', 
            'export_data',
            'access_promo_sales',
            'view_promo_analytics',
            'access_customer_service',
            'view_call_history',
            'view_call_scripts',
            'make_calls',
            'view_own_calls'
          ],
          createdAt: new Date().toISOString()
        }
      },
      'manager1': {
        password: 'manager123',
        user: {
          id: '4',
          username: 'manager1',
          name: 'Adewale Johnson',
          email: 'adewale.johnson@btmtravel.net',
          role: 'manager',
          permissions: [
            'view_team_performance', 
            'view_all_agents', 
            'generate_reports', 
            'export_data',
            'view_call_history',
            'export_call_history',
            'view_audit_logs'
          ],
          createdAt: new Date().toISOString()
        }
      },
      'manager2': {
        password: 'manager123',
        user: {
          id: '5',
          username: 'manager2',
          name: 'Chidinma Okafor',
          email: 'chidinma.okafor@btmtravel.net',
          role: 'manager',
          permissions: [
            'manage_customers', 
            'view_customer_details', 
            'edit_customer_notes', 
            'generate_reports', 
            'export_data',
            'access_customer_service',
            'manage_promotions',
            'access_promo_sales',
            'view_call_scripts'
          ],
          createdAt: new Date().toISOString()
        }
      },
      'agent': {
        password: 'agent123',
        user: {
          id: '3',
          username: 'agent',
          name: 'Agent User',
          email: 'agent@btmtravel.net',
          role: 'agent',
          dailyTarget: 35,
          createdAt: new Date().toISOString()
        }
      }
    };

    const account = demoUsers[username.toLowerCase()];
    if (account && account.password === password) {
      console.log('[LOGIN] Matched demo user:', username);
      setCurrentUser(account.user);
      localStorage.setItem('btm_current_user', JSON.stringify(account.user));
      
      // Log audit trail
      try {
        const auditLogs = JSON.parse(localStorage.getItem('loginAuditLogs') || '[]');
        auditLogs.push({
          id: Date.now().toString(),
          userId: account.user.id,
          username: account.user.username,
          name: account.user.name,
          role: account.user.role,
          timestamp: new Date().toISOString(),
          success: true,
          ipAddress: 'N/A'
        });
        localStorage.setItem('loginAuditLogs', JSON.stringify(auditLogs));
      } catch (e) {
        console.error('[LOGIN] Failed to log audit:', e);
      }
      
      return true;
    }

    console.log('[LOGIN] No match found for username:', username);
    
    // Log failed login attempt
    try {
      const auditLogs = JSON.parse(localStorage.getItem('loginAuditLogs') || '[]');
      auditLogs.push({
        id: Date.now().toString(),
        userId: 'unknown',
        username: username,
        name: 'Unknown',
        role: 'unknown',
        timestamp: new Date().toISOString(),
        success: false,
        ipAddress: 'N/A'
      });
      localStorage.setItem('loginAuditLogs', JSON.stringify(auditLogs));
    } catch (e) {
      console.error('[LOGIN] Failed to log failed attempt:', e);
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('btm_current_user');
  };

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager' || isAdmin;
  const dailyTarget = currentUser?.dailyTarget ?? globalTarget;

  const hasPermission = (permission: Permission): boolean => {
    // Admins have all permissions
    if (isAdmin) return true;
    
    // Agents have no special permissions
    if (currentUser?.role === 'agent') return false;
    
    // Managers have permissions based on their assigned permissions
    if (currentUser?.role === 'manager') {
      return currentUser.permissions?.includes(permission) ?? false;
    }
    
    return false;
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isAdmin, 
      isManager,
      hasPermission,
      dailyTarget,
      callsToday,
      incrementCallCount
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
