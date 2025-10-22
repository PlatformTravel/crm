// Mock Backend for Demo Mode
// Provides fake data so app works without deployment

export class MockBackend {
  private static clients: any[] = [];
  private static customers: any[] = [];
  private static callScripts: any[] = [
    {
      id: 'script-1',
      name: 'Initial Contact',
      content: 'Hello, this is [Your Name] from BTM Travel. How are you today?',
      category: 'prospecting',
      active: true
    },
    {
      id: 'script-2',
      name: 'Follow-up',
      content: 'Hi again! I wanted to follow up on our previous conversation.',
      category: 'followup',
      active: true
    }
  ];
  private static settings: any = {
    emailNotifications: true,
    dailyReportTime: '18:00',
    recipients: []
  };
  
  private static smtpSettings: any = {
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: ''
  };
  
  private static dailyProgress: any = {};
  private static lastReset: string = new Date().toISOString().split('T')[0];
  
  private static callScripts: any = {
    prospective: "Welcome to BTM Travel! I'm calling to discuss our exclusive travel packages to Dubai, Turkey, and the Maldives. We have special offers this month with discounts up to 30%.",
    customer: "Thank you for being a valued BTM Travel customer. I'm calling to check on your recent booking and see if you need any additional services."
  };
  
  private static archivedContacts: any[] = [];
  
  private static globalTarget: number = 30;
  
  private static users: any[] = [
    {
      id: 'admin-1',
      username: 'admin',
      name: 'Admin User',
      email: 'admin@btmtravel.net',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'manager-1',
      username: 'manager',
      name: 'Manager User',
      email: 'manager@btmtravel.net',
      password: 'manager123',
      role: 'manager',
      createdAt: new Date().toISOString()
    },
    {
      id: 'agent-1',
      username: 'agent1',
      name: 'Agent One',
      email: 'agent1@btmtravel.net',
      password: 'agent123',
      role: 'agent',
      dailyTarget: 30,
      createdAt: new Date().toISOString()
    }
  ];

  static async health() {
    return {
      status: 'ok',
      message: '⚠️ DEMO MODE - Mock Backend Active',
      mode: 'demo',
      timestamp: new Date().toISOString()
    };
  }

  static async getClients() {
    return {
      clients: this.clients,
      count: this.clients.length
    };
  }

  static async addClient(client: any) {
    const newClient = {
      ...client,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.clients.push(newClient);
    return newClient;
  }

  static async updateClient(id: string, updates: any) {
    const index = this.clients.findIndex(c => c.id === id);
    if (index >= 0) {
      this.clients[index] = { ...this.clients[index], ...updates };
      return this.clients[index];
    }
    throw new Error('Client not found');
  }

  static async deleteClient(id: string) {
    const index = this.clients.findIndex(c => c.id === id);
    if (index >= 0) {
      this.clients.splice(index, 1);
      return { success: true };
    }
    throw new Error('Client not found');
  }

  static async getCustomers() {
    return {
      customers: this.customers,
      count: this.customers.length
    };
  }

  static async addCustomer(customer: any) {
    const newCustomer = {
      ...customer,
      id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  static async updateCustomer(id: string, updates: any) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index >= 0) {
      this.customers[index] = { ...this.customers[index], ...updates };
      return this.customers[index];
    }
    throw new Error('Customer not found');
  }

  static async deleteCustomer(id: string) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index >= 0) {
      this.customers.splice(index, 1);
      return { success: true };
    }
    throw new Error('Customer not found');
  }

  static async bulkImport(type: 'clients' | 'customers', data: any[]) {
    const imported = data.map((item, index) => ({
      ...item,
      id: `${type}-${Date.now()}-${index}`,
      createdAt: new Date().toISOString()
    }));

    if (type === 'clients') {
      this.clients.push(...imported);
    } else {
      this.customers.push(...imported);
    }

    return {
      success: true,
      imported: imported.length,
      data: imported
    };
  }

  static async getCallScripts() {
    return {
      scripts: this.callScripts,
      count: this.callScripts.length
    };
  }

  static async addCallScript(script: any) {
    const newScript = {
      ...script,
      id: `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      active: true
    };
    this.callScripts.push(newScript);
    return newScript;
  }

  static async updateCallScript(id: string, updates: any) {
    const index = this.callScripts.findIndex(s => s.id === id);
    if (index >= 0) {
      this.callScripts[index] = { ...this.callScripts[index], ...updates };
      return this.callScripts[index];
    }
    throw new Error('Script not found');
  }

  static async deleteCallScript(id: string) {
    const index = this.callScripts.findIndex(s => s.id === id);
    if (index >= 0) {
      this.callScripts.splice(index, 1);
      return { success: true };
    }
    throw new Error('Script not found');
  }

  static async getSettings() {
    return this.settings;
  }

  static async updateSettings(updates: any) {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  static async assignNumbers(data: any) {
    const { numbers, assignedTo, assignedBy } = data;
    
    // Mock assignment
    return {
      success: true,
      assigned: numbers.length,
      message: `⚠️ DEMO MODE: ${numbers.length} numbers mock-assigned to ${assignedTo}`
    };
  }

  static async getTeamPerformance() {
    return {
      teamMembers: [
        { username: 'agent1', callsToday: 0, callsWeek: 0, callsMonth: 0 },
        { username: 'agent2', callsToday: 0, callsWeek: 0, callsMonth: 0 }
      ],
      totalCalls: 0
    };
  }

  static async resetDatabase() {
    this.clients = [];
    this.customers = [];
    this.callScripts = [
      {
        id: 'script-1',
        name: 'Initial Contact',
        content: 'Hello, this is [Your Name] from BTM Travel. How are you today?',
        category: 'prospecting',
        active: true
      }
    ];
    return { success: true, message: '⚠️ DEMO MODE: Mock database reset' };
  }

  static async getAdminSettings() {
    return {
      globalTarget: this.globalTarget,
      users: this.users
    };
  }

  static async setGlobalTarget(target: number) {
    this.globalTarget = target;
    return { success: true, globalTarget: target };
  }

  static async addUser(user: any) {
    const newUser = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return { success: true, user: newUser };
  }

  static async updateUser(userId: string, updates: any) {
    const index = this.users.findIndex(u => u.id === userId);
    if (index >= 0) {
      this.users[index] = { ...this.users[index], ...updates };
      return { success: true, user: this.users[index] };
    }
    throw new Error('User not found');
  }

  static async deleteUser(userId: string) {
    const index = this.users.findIndex(u => u.id === userId);
    if (index >= 0) {
      this.users.splice(index, 1);
      return { success: true };
    }
    throw new Error('User not found');
  }

  static async getSMTPSettings() {
    return this.smtpSettings;
  }

  static async updateSMTPSettings(settings: any) {
    this.smtpSettings = { ...this.smtpSettings, ...settings };
    return { success: true, settings: this.smtpSettings };
  }

  static async getDailyProgress() {
    return {
      progress: this.dailyProgress,
      lastReset: this.lastReset
    };
  }

  static async updateDailyProgress(username: string, data: any) {
    this.dailyProgress[username] = data;
    return { success: true };
  }

  static async checkAutoReset() {
    const today = new Date().toISOString().split('T')[0];
    if (this.lastReset !== today) {
      this.dailyProgress = {};
      this.lastReset = today;
      return { reset: true, message: '🎭 Demo: Daily progress reset' };
    }
    return { reset: false };
  }

  static async getCallScript(type: string) {
    return {
      success: true,
      script: this.callScripts[type] || this.callScripts.prospective
    };
  }

  static async updateCallScript(type: string, script: string) {
    this.callScripts[type] = script;
    return { success: true };
  }

  static async getArchivedContacts() {
    return {
      success: true,
      contacts: this.archivedContacts
    };
  }

  static async archiveContact(contactId: string) {
    const clientIndex = this.clients.findIndex(c => c.id === contactId);
    if (clientIndex >= 0) {
      const contact = this.clients.splice(clientIndex, 1)[0];
      this.archivedContacts.push({ ...contact, archivedAt: new Date().toISOString() });
      return { success: true };
    }
    return { success: false };
  }

  static clearData() {
    this.clients = [];
    this.customers = [];
  }
}
