// Data Service - Smart fallback between Backend and LocalStorage
// Automatically uses localStorage when backend is unavailable

import { backendService } from './backendService';
import { localStorageService } from './localStorageService';

// Track backend availability
let backendAvailable = true;
let lastBackendCheck = 0;
const CHECK_INTERVAL = 30000; // Check every 30 seconds

// Check if backend is available
async function isBackendAvailable(): Promise<boolean> {
  const now = Date.now();
  
  // Return cached result if checked recently
  if (now - lastBackendCheck < CHECK_INTERVAL) {
    return backendAvailable;
  }
  
  try {
    await backendService.health();
    backendAvailable = true;
    lastBackendCheck = now;
    return true;
  } catch {
    backendAvailable = false;
    lastBackendCheck = now;
    return false;
  }
}

// Wrapper function that tries backend first, falls back to localStorage
async function withFallback<T>(
  backendFn: () => Promise<any>,
  localStorageFn: () => T,
  options: { silent?: boolean } = {}
): Promise<T> {
  try {
    const result = await backendFn();
    backendAvailable = true;
    return result;
  } catch (error: any) {
    // If backend is unavailable, use localStorage silently
    if (!options.silent) {
      console.log('[DataService] Using localStorage (backend unavailable)');
    }
    backendAvailable = false;
    return localStorageFn() as T;
  }
}

export const dataService = {
  // Check if we're in offline mode
  isOfflineMode: () => !backendAvailable,
  
  // Force check backend availability
  checkBackend: isBackendAvailable,

  // Users & Authentication
  async login(username: string, password: string) {
    try {
      return await backendService.login(username, password);
    } catch {
      // Fallback to localStorage auth
      const users = localStorageService.getUsers();
      const user = users.find((u: any) => 
        u.username === username && u.password === password && u.isActive
      );
      
      if (user) {
        localStorageService.setCurrentUser(user);
        localStorageService.addLoginAudit({
          userId: user.id,
          username: user.username,
          success: true,
          mode: 'offline',
        });
        return {
          success: true,
          user: { ...user, password: undefined }, // Don't return password
          message: 'Login successful (offline mode)',
        };
      } else {
        localStorageService.addLoginAudit({
          username,
          success: false,
          mode: 'offline',
        });
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }
    }
  },

  async getUsers() {
    return withFallback(
      () => backendService.getUsers(),
      () => ({ success: true, users: localStorageService.getUsers() }),
      { silent: true }
    );
  },

  async getAgents() {
    return withFallback(
      () => backendService.getAgents(),
      () => {
        const users = localStorageService.getUsers();
        const agents = users.filter((u: any) => u.role === 'agent' && u.isActive);
        return { success: true, agents };
      },
      { silent: true }
    );
  },

  async addUser(user: any) {
    return withFallback(
      () => backendService.addUser(user),
      () => {
        const newUser = localStorageService.addUser(user);
        return { success: true, user: newUser };
      }
    );
  },

  async updateUser(userId: string, updates: any) {
    return withFallback(
      () => backendService.updateUser(userId, updates),
      () => {
        const updated = localStorageService.updateUser(userId, updates);
        return { success: true, user: updated };
      }
    );
  },

  async deleteUser(userId: string) {
    return withFallback(
      () => backendService.deleteUser(userId),
      () => {
        localStorageService.deleteUser(userId);
        return { success: true };
      }
    );
  },

  // Special Database
  async getSpecialDatabase() {
    return withFallback(
      () => backendService.getSpecialDatabase(),
      () => ({ success: true, numbers: localStorageService.getSpecialDatabase() }),
      { silent: true }
    );
  },

  async uploadToSpecialDatabase(data: { phoneNumbers: string[]; purpose: string; notes?: string }) {
    return withFallback(
      () => backendService.uploadToSpecialDatabase(data),
      () => {
        const numbers = data.phoneNumbers.map(phone => ({
          id: `special_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          phoneNumber: phone,
          purpose: data.purpose,
          notes: data.notes,
          uploadedAt: new Date().toISOString(),
          status: 'available',
        }));
        localStorageService.addSpecialNumbers(numbers);
        return { success: true, count: numbers.length };
      }
    );
  },

  async assignSpecialNumbers(numberIds: string[], agentId: string) {
    return withFallback(
      () => backendService.assignSpecialNumbers(numberIds, agentId),
      () => {
        numberIds.forEach(id => {
          localStorageService.updateSpecialNumber(id, {
            status: 'assigned',
            assignedTo: agentId,
            assignedAt: new Date().toISOString(),
          });
        });
        return { success: true, count: numberIds.length };
      }
    );
  },

  async deleteSpecialNumber(numberId: string) {
    return withFallback(
      () => backendService.deleteSpecialNumber(numberId),
      () => {
        localStorageService.deleteSpecialNumber(numberId);
        return { success: true };
      }
    );
  },

  async getSpecialDatabaseArchive() {
    return withFallback(
      () => backendService.getSpecialDatabaseArchive(),
      () => ({ success: true, archived: localStorageService.getSpecialArchive() }),
      { silent: true }
    );
  },

  async recycleSpecialNumbers(numberIds: string[]) {
    return withFallback(
      () => backendService.recycleSpecialNumbers({ numberIds }),
      () => {
        localStorageService.recycleFromSpecialArchive(numberIds);
        return { success: true, count: numberIds.length };
      }
    );
  },

  // Call History
  async getCallHistory(agentId?: string) {
    return withFallback(
      () => backendService.getCallHistory(agentId),
      () => {
        let history = localStorageService.getCallHistory();
        if (agentId) {
          history = history.filter((h: any) => h.agentId === agentId);
        }
        return { success: true, calls: history };
      },
      { silent: true }
    );
  },

  async logCall(call: any) {
    return withFallback(
      () => backendService.logCall(call),
      () => {
        localStorageService.addCallHistory(call);
        return { success: true };
      }
    );
  },

  // Email Recipients
  async getEmailRecipients() {
    return withFallback(
      () => backendService.getEmailRecipients(),
      () => ({ 
        success: true, 
        recipients: localStorageService.getEmailRecipients().length > 0
          ? localStorageService.getEmailRecipients()
          : ['operations@btmlimited.net', 'quantityassurance@btmlimited.net', 'clientcare@btmlimited.net']
      }),
      { silent: true }
    );
  },

  async saveEmailRecipients(recipients: string[]) {
    return withFallback(
      () => backendService.saveEmailRecipients(recipients),
      () => {
        localStorageService.saveEmailRecipients(recipients);
        return { success: true };
      }
    );
  },

  // Database Management
  async getDatabaseClients() {
    return withFallback(
      () => backendService.getDatabaseClients(),
      () => ({ success: true, clients: localStorageService.getDatabaseClients() }),
      { silent: true }
    );
  },

  async uploadDatabaseClients(clients: any[]) {
    return withFallback(
      () => backendService.uploadDatabaseClients(clients),
      () => {
        localStorageService.saveDatabaseClients(clients);
        return { success: true, count: clients.length };
      }
    );
  },

  async getDatabaseCustomers() {
    return withFallback(
      () => backendService.getDatabaseCustomers(),
      () => ({ success: true, customers: localStorageService.getDatabaseCustomers() }),
      { silent: true }
    );
  },

  async uploadDatabaseCustomers(customers: any[]) {
    return withFallback(
      () => backendService.uploadDatabaseCustomers(customers),
      () => {
        localStorageService.saveDatabaseCustomers(customers);
        return { success: true, count: customers.length };
      }
    );
  },

  // Agent Assignments
  async getAgentNumbers(agentId: string) {
    return withFallback(
      () => backendService.getAgentNumbers(agentId),
      () => {
        const assignment = localStorageService.getAgentAssignment(agentId);
        return { 
          success: true, 
          numbers: assignment?.numbers || [],
          specialNumbers: assignment?.specialNumbers || [],
        };
      },
      { silent: true }
    );
  },

  async assignNumbersToAgent(agentId: string, numbers: any[], type: 'client' | 'customer') {
    return withFallback(
      () => backendService.assignNumbersToAgent(agentId, numbers, type),
      () => {
        const assignment = localStorageService.getAgentAssignment(agentId) || { agentId, numbers: [], specialNumbers: [] };
        assignment.numbers = numbers;
        assignment.assignedAt = new Date().toISOString();
        assignment.type = type;
        localStorageService.updateAgentAssignment(agentId, assignment);
        return { success: true, count: numbers.length };
      }
    );
  },

  async markNumberCalled(agentId: string, numberId: string, notes?: string) {
    return withFallback(
      () => backendService.markNumberCalled(agentId, numberId, notes),
      () => {
        const assignment = localStorageService.getAgentAssignment(agentId);
        if (assignment?.numbers) {
          const number = assignment.numbers.find((n: any) => n.id === numberId);
          if (number) {
            number.called = true;
            number.calledAt = new Date().toISOString();
            if (notes) number.notes = notes;
            localStorageService.updateAgentAssignment(agentId, assignment);
          }
        }
        return { success: true };
      }
    );
  },

  // Settings
  async getThreeCXSettings() {
    return withFallback(
      () => backendService.getThreeCXSettings(),
      () => ({ success: true, settings: localStorageService.getThreeCXSettings() }),
      { silent: true }
    );
  },

  async saveThreeCXSettings(settings: any) {
    return withFallback(
      () => backendService.saveThreeCXSettings(settings),
      () => {
        localStorageService.saveThreeCXSettings(settings);
        return { success: true };
      }
    );
  },

  async getSMTPSettings() {
    return withFallback(
      () => backendService.getSMTPSettings(),
      () => ({ success: true, settings: localStorageService.getSMTPSettings() }),
      { silent: true }
    );
  },

  async saveSMTPSettings(settings: any) {
    return withFallback(
      () => backendService.saveSMTPSettings(settings),
      () => {
        localStorageService.saveSMTPSettings(settings);
        return { success: true };
      }
    );
  },

  // Login Audit
  async getLoginAudit() {
    return withFallback(
      () => backendService.getLoginAudit(),
      () => ({ success: true, audit: localStorageService.getLoginAudit() }),
      { silent: true }
    );
  },

  // Health check
  async health() {
    try {
      const result = await backendService.health();
      backendAvailable = true;
      return result;
    } catch {
      backendAvailable = false;
      return {
        status: 'offline',
        message: 'Running in offline mode (localStorage)',
        mode: 'localStorage',
      };
    }
  },
};
