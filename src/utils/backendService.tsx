// Backend Service - Pure MongoDB Backend (No Supabase!)
import { BACKEND_URL } from './config';

// Track if we're in demo mode (backend offline)
let demoModeDetected = false;

// Generic fetch wrapper for backend calls
async function backendFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${BACKEND_URL}${endpoint}`;
  
  // Only log if not in demo mode
  if (!demoModeDetected) {
    console.log(`[BACKEND] ${options.method || 'GET'} ${endpoint}`);
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BACKEND ERROR] ${response.status}: ${errorText}`);
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!demoModeDetected) {
      console.log(`[BACKEND] ✅ Success: ${endpoint}`);
    }
    return data;
  } catch (error: any) {
    // Silently fail if backend isn't running (demo mode)
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      // Only show the error message once
      if (!demoModeDetected) {
        demoModeDetected = true;
        console.log('%c🎮 Demo Mode Active ', 'background: #8b5cf6; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px; font-weight: bold;');
        console.log('%c💾 Using browser storage - Backend offline', 'background: #3b82f6; color: white; font-size: 12px; padding: 4px 8px; border-radius: 4px;');
      }
      throw new Error('DEMO_MODE'); // Special error code for demo mode
    }
    console.error(`[BACKEND ERROR] Failed to call ${endpoint}:`, error);
    throw error;
  }
}

// Public API
export const backendService = {
  // Health Check
  async health() {
    return backendFetch('/health');
  },

  // Users & Authentication
  async login(username: string, password: string) {
    return backendFetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getUsers() {
    return backendFetch('/users');
  },

  async addUser(user: any) {
    return backendFetch('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async updateUser(userId: string, updates: any) {
    return backendFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteUser(userId: string) {
    return backendFetch(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Login Audit
  async getLoginAudit() {
    return backendFetch('/login-audit');
  },

  // Numbers Database
  async getClients() {
    return backendFetch('/database/clients');
  },

  async importClients(clients: any[]) {
    return backendFetch('/database/clients/import', {
      method: 'POST',
      body: JSON.stringify({ clients }),
    });
  },

  async assignClients(payload: { clientIds?: string[], agentId: string, filters?: any }) {
    return backendFetch('/database/clients/assign', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteClient(clientId: string) {
    return backendFetch(`/database/clients/${clientId}`, {
      method: 'DELETE',
    });
  },

  async bulkDeleteClients(ids: string[]) {
    return backendFetch('/database/clients/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },

  // Number Assignments
  async getAssignments(agentId?: string) {
    const params = agentId ? `?agentId=${agentId}` : '';
    return backendFetch(`/assignments${params}`);
  },

  async claimAssignment(assignmentId: string, agentId: string) {
    return backendFetch('/assignments/claim', {
      method: 'POST',
      body: JSON.stringify({ assignmentId, agentId }),
    });
  },

  async markAssignmentCalled(assignmentId: string, outcome?: string) {
    return backendFetch('/assignments/mark-called', {
      method: 'POST',
      body: JSON.stringify({ assignmentId, outcome }),
    });
  },

  // Call Logs
  async getCallLogs(agentId?: string) {
    const params = agentId ? `?agentId=${agentId}` : '';
    return backendFetch(`/call-logs${params}`);
  },

  async addCallLog(callLog: any) {
    return backendFetch('/call-logs', {
      method: 'POST',
      body: JSON.stringify(callLog),
    });
  },

  // Call Scripts
  async getCallScripts() {
    return backendFetch('/call-scripts');
  },

  async addCallScript(script: any) {
    return backendFetch('/call-scripts', {
      method: 'POST',
      body: JSON.stringify(script),
    });
  },

  async activateCallScript(scriptId: string) {
    return backendFetch(`/call-scripts/${scriptId}/activate`, {
      method: 'POST',
    });
  },

  async deleteCallScript(scriptId: string) {
    return backendFetch(`/call-scripts/${scriptId}`, {
      method: 'DELETE',
    });
  },

  async getActiveCallScript(type: 'prospective' | 'existing') {
    return backendFetch(`/call-scripts/active/${type}`);
  },

  // Daily Progress
  async getDailyProgress() {
    return backendFetch('/daily-progress');
  },

  async updateDailyProgress(userId: string, callsToday: number, lastCallTime?: string) {
    return backendFetch('/daily-progress', {
      method: 'POST',
      body: JSON.stringify({ userId, callsToday, lastCallTime }),
    });
  },

  async checkDailyReset() {
    return backendFetch('/daily-progress/check-reset');
  },

  async resetDailyProgress() {
    return backendFetch('/daily-progress/reset', {
      method: 'POST',
    });
  },

  // Promotions
  async getPromotions() {
    return backendFetch('/promotions');
  },

  async addPromotion(promotion: any) {
    return backendFetch('/promotions', {
      method: 'POST',
      body: JSON.stringify(promotion),
    });
  },

  async updatePromotion(promotionId: string, updates: any) {
    return backendFetch(`/promotions/${promotionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deletePromotion(promotionId: string) {
    return backendFetch(`/promotions/${promotionId}`, {
      method: 'DELETE',
    });
  },

  // SMTP Settings
  async getSMTPSettings() {
    return backendFetch('/smtp-settings');
  },

  async updateSMTPSettings(settings: any) {
    return backendFetch('/smtp-settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  async testSMTP(testEmail: string) {
    return backendFetch('/smtp-test', {
      method: 'POST',
      body: JSON.stringify({ testEmail }),
    });
  },

  // 3CX Settings
  async get3CXSettings() {
    return backendFetch('/threecx-settings');
  },

  async update3CXSettings(settings: any) {
    return backendFetch('/threecx-settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  // Archive
  async getArchive(type?: string) {
    const params = type ? `?type=${type}` : '';
    return backendFetch(`/archive${params}`);
  },

  async archiveItem(item: any) {
    return backendFetch('/archive', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async restoreFromArchive(archiveId: string, entityType: string) {
    return backendFetch('/archive/restore', {
      method: 'POST',
      body: JSON.stringify({ archiveId, entityType }),
    });
  },

  // Legacy compatibility - these methods return mock data
  async getAdminSettings() {
    // Return users data instead (admin settings now handled per-user)
    const usersResponse = await this.getUsers();
    return {
      success: true,
      settings: {
        globalTarget: 30,
        users: usersResponse.users || []
      }
    };
  },

  async setGlobalTarget(target: number) {
    // Global target is now per-user, this is a no-op
    console.log('[BACKEND] Global target is now per-user. Update individual user targets.');
    return { success: true };
  },

  async resetDatabase() {
    console.log('[BACKEND] Database reset not implemented in MongoDB version');
    return { success: false, error: 'Not implemented' };
  },
};
