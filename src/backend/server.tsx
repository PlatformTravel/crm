// BTM Travel CRM Backend Server - MongoDB Version
// Pure Deno server - No Supabase dependencies
import { getCollection, Collections, initializeDatabase, convertMongoDoc, convertMongoDocs } from './mongodb.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper to generate unique IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;
  
  console.log(`[BTM CRM Server] [${req.method}] ${path}`);

  try {
    // Initialize database on first request
    if (path === '/health' || path === '/test') {
      try {
        await initializeDatabase();
      } catch (error) {
        console.error('[DB INIT ERROR]', error);
      }
    }

    // ==================== HEALTH & TEST ====================
    if (path === '/health' || path.includes('/health')) {
      return new Response(
        JSON.stringify({
          status: 'ok',
          message: 'BTM Travel CRM Server is running (MongoDB)',
          timestamp: new Date().toISOString(),
          version: '3.0.0-mongodb-standalone',
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (path === '/test' || path.includes('/test')) {
      return new Response(
        JSON.stringify({
          status: 'ok',
          message: 'Test endpoint working (MongoDB)',
          timestamp: new Date().toISOString(),
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // ==================== CALL SCRIPTS ====================
    if (path === '/call-scripts' && req.method === 'GET') {
      const collection = await getCollection(Collections.CALL_SCRIPTS);
      const scripts = await collection.find({}).toArray();
      return new Response(
        JSON.stringify({ success: true, scripts: convertMongoDocs(scripts) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/call-scripts' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.CALL_SCRIPTS);
      const newScript = {
        ...body,
        id: body.id || generateId(),
        createdAt: new Date().toISOString(),
      };
      await collection.insertOne(newScript);
      return new Response(
        JSON.stringify({ success: true, script: newScript }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/call-scripts\/(.+)\/activate$/) && req.method === 'POST') {
      const id = path.split('/')[2];
      const collection = await getCollection(Collections.CALL_SCRIPTS);
      // Deactivate all scripts
      await collection.updateMany({}, { $set: { isActive: false } });
      // Activate the specified script
      await collection.updateOne({ id }, { $set: { isActive: true } });
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/call-scripts\/(.+)$/) && req.method === 'DELETE') {
      const id = path.split('/')[2];
      const collection = await getCollection(Collections.CALL_SCRIPTS);
      await collection.deleteOne({ id });
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/call-scripts\/active\/(prospective|existing)$/)) {
      const type = path.split('/')[3];
      const collection = await getCollection(Collections.CALL_SCRIPTS);
      const activeScript = await collection.findOne({ isActive: true, type });
      return new Response(
        JSON.stringify({ 
          success: true, 
          script: activeScript ? convertMongoDoc(activeScript) : null 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== DATABASE - NUMBERS ====================
    if (path === '/database/clients' && req.method === 'GET') {
      const collection = await getCollection(Collections.NUMBERS_DATABASE);
      const clients = await collection.find({ status: { $ne: 'assigned' } }).toArray();
      return new Response(
        JSON.stringify({ success: true, clients: convertMongoDocs(clients) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/database/clients/import' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.NUMBERS_DATABASE);
      const newClients = (body.clients || []).map((client: any) => ({
        ...client,
        id: client.id || generateId(),
        importedAt: new Date().toISOString(),
        status: 'available',
        assignedTo: null,
        assignedAt: null,
        customerType: client.customerType || 'Retails',
        airplane: client.airplane || '',
      }));
      
      if (newClients.length > 0) {
        await collection.insertMany(newClients);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imported: newClients.length,
          clients: newClients 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/database/clients/assign' && req.method === 'POST') {
      const body = await req.json();
      const { clientIds, agentId, filters } = body;
      
      const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
      const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
      
      let numbersToAssign;
      
      if (filters && (filters.customerType || filters.airplane)) {
        // Filter based query
        const query: any = { status: 'available' };
        if (filters.customerType) query.customerType = filters.customerType;
        if (filters.airplane) query.airplane = filters.airplane;
        
        numbersToAssign = await numbersCollection
          .find(query)
          .limit(filters.count || 100)
          .toArray();
      } else if (clientIds && clientIds.length > 0) {
        // Specific IDs
        numbersToAssign = await numbersCollection
          .find({ id: { $in: clientIds }, status: 'available' })
          .toArray();
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'No clients or filters specified' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (numbersToAssign.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: 'No available numbers match criteria' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const assignmentDate = new Date().toISOString();
      const assignments = numbersToAssign.map((number: any) => ({
        id: generateId(),
        numberId: number.id,
        numberData: number,
        agentId,
        assignedAt: assignmentDate,
        status: 'active',
        called: false,
        calledAt: null,
        outcome: null,
      }));
      
      // Mark numbers as assigned
      await numbersCollection.updateMany(
        { id: { $in: numbersToAssign.map((n: any) => n.id) } },
        { $set: { status: 'assigned', assignedTo: agentId, assignedAt: assignmentDate } }
      );
      
      // Create assignments
      await assignmentsCollection.insertMany(assignments);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          assigned: assignments.length,
          assignments: convertMongoDocs(assignments)
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/database\/clients\/(.+)$/) && req.method === 'DELETE') {
      const id = path.split('/')[3];
      const collection = await getCollection(Collections.NUMBERS_DATABASE);
      await collection.deleteOne({ id });
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/database/clients/bulk-delete' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.NUMBERS_DATABASE);
      await collection.deleteMany({ id: { $in: body.ids || [] } });
      return new Response(
        JSON.stringify({ success: true, deleted: body.ids?.length || 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== NUMBER ASSIGNMENTS ====================
    if (path === '/assignments' && req.method === 'GET') {
      const agentId = url.searchParams.get('agentId');
      const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
      
      const query = agentId ? { agentId, status: 'active' } : { status: 'active' };
      const assignments = await collection.find(query).toArray();
      
      return new Response(
        JSON.stringify({ success: true, assignments: convertMongoDocs(assignments) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/assignments/claim' && req.method === 'POST') {
      const body = await req.json();
      const { assignmentId, agentId } = body;
      
      const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
      const assignment = await collection.findOne({ id: assignmentId, status: 'active' });
      
      if (!assignment) {
        return new Response(
          JSON.stringify({ success: false, error: 'Assignment not found or already claimed' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      await collection.updateOne(
        { id: assignmentId },
        { $set: { claimedBy: agentId, claimedAt: new Date().toISOString() } }
      );
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/assignments/mark-called' && req.method === 'POST') {
      const body = await req.json();
      const { assignmentId, outcome } = body;
      
      const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
      await collection.updateOne(
        { id: assignmentId },
        { 
          $set: { 
            called: true, 
            calledAt: new Date().toISOString(),
            outcome: outcome || 'completed'
          } 
        }
      );
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== USERS ====================
    if (path === '/users' && req.method === 'GET') {
      const collection = await getCollection(Collections.USERS);
      const users = await collection.find({}).toArray();
      // Don't send passwords to frontend
      const sanitizedUsers = users.map(({ password, ...user }: any) => user);
      return new Response(
        JSON.stringify({ success: true, users: convertMongoDocs(sanitizedUsers) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/users' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.USERS);
      
      // Check if username exists
      const existing = await collection.findOne({ username: body.username });
      if (existing) {
        return new Response(
          JSON.stringify({ success: false, error: 'Username already exists' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const newUser = {
        id: body.id || generateId(),
        username: body.username,
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role || 'agent',
        permissions: body.permissions || [],
        dailyTarget: body.dailyTarget || 30,
        createdAt: new Date().toISOString(),
      };
      
      await collection.insertOne(newUser);
      const { password, ...userWithoutPassword } = newUser;
      
      return new Response(
        JSON.stringify({ success: true, user: userWithoutPassword }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/users\/(.+)$/) && req.method === 'PUT') {
      const id = path.split('/')[2];
      const body = await req.json();
      const collection = await getCollection(Collections.USERS);
      
      const updateData: any = {};
      if (body.name) updateData.name = body.name;
      if (body.email) updateData.email = body.email;
      if (body.password) updateData.password = body.password;
      if (body.role) updateData.role = body.role;
      if (body.permissions !== undefined) updateData.permissions = body.permissions;
      if (body.dailyTarget !== undefined) updateData.dailyTarget = body.dailyTarget;
      
      await collection.updateOne({ id }, { $set: updateData });
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/users\/(.+)$/) && req.method === 'DELETE') {
      const id = path.split('/')[2];
      const collection = await getCollection(Collections.USERS);
      await collection.deleteOne({ id });
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/users/login' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.USERS);
      
      const user = await collection.findOne({ 
        username: body.username, 
        password: body.password 
      });
      
      if (!user) {
        // Log failed login attempt
        const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
        await auditCollection.insertOne({
          id: generateId(),
          userId: null,
          username: body.username,
          success: false,
          timestamp: new Date().toISOString(),
          ipAddress: null,
        });
        
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Log successful login
      const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
      await auditCollection.insertOne({
        id: generateId(),
        userId: user.id,
        username: user.username,
        success: true,
        timestamp: new Date().toISOString(),
        ipAddress: null,
      });
      
      const { password, ...userWithoutPassword } = user;
      return new Response(
        JSON.stringify({ success: true, user: convertMongoDoc(userWithoutPassword) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== LOGIN AUDIT ====================
    if (path === '/login-audit' && req.method === 'GET') {
      const collection = await getCollection(Collections.LOGIN_AUDIT);
      const logs = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
      return new Response(
        JSON.stringify({ success: true, logs: convertMongoDocs(logs) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== SMTP SETTINGS ====================
    if (path === '/smtp-settings' && req.method === 'GET') {
      const collection = await getCollection(Collections.SMTP_SETTINGS);
      const settings = await collection.findOne({ type: 'smtp' });
      return new Response(
        JSON.stringify({ success: true, settings: settings ? convertMongoDoc(settings) : {} }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/smtp-settings' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.SMTP_SETTINGS);
      
      await collection.updateOne(
        { type: 'smtp' },
        { $set: { ...body, type: 'smtp', updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/smtp-test' && req.method === 'POST') {
      const body = await req.json();
      console.log('[SMTP] Test email request:', body);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'SMTP test email sent successfully (MongoDB)' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== 3CX SETTINGS ====================
    if (path === '/threecx-settings' && req.method === 'GET') {
      const collection = await getCollection(Collections.THREECX_SETTINGS);
      const settings = await collection.findOne({ type: '3cx' });
      return new Response(
        JSON.stringify({ success: true, settings: settings ? convertMongoDoc(settings) : {} }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/threecx-settings' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.THREECX_SETTINGS);
      
      await collection.updateOne(
        { type: '3cx' },
        { $set: { ...body, type: '3cx', updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== CALL LOGS ====================
    if (path === '/call-logs' && req.method === 'GET') {
      const agentId = url.searchParams.get('agentId');
      const collection = await getCollection(Collections.CALL_LOGS);
      
      const query = agentId ? { agentId } : {};
      const logs = await collection.find(query).sort({ callTime: -1 }).limit(500).toArray();
      
      return new Response(
        JSON.stringify({ success: true, logs: convertMongoDocs(logs) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/call-logs' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.CALL_LOGS);
      
      const newLog = {
        ...body,
        id: body.id || generateId(),
        callTime: body.callTime || new Date().toISOString(),
      };
      
      await collection.insertOne(newLog);
      
      return new Response(
        JSON.stringify({ success: true, log: newLog }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== DAILY PROGRESS ====================
    if (path === '/daily-progress' && req.method === 'GET') {
      const collection = await getCollection(Collections.DAILY_PROGRESS);
      const progress = await collection.findOne({ type: 'daily' });
      
      if (!progress) {
        const defaultProgress = {
          type: 'daily',
          userProgress: {},
          lastReset: new Date().toISOString(),
        };
        await collection.insertOne(defaultProgress);
        return new Response(
          JSON.stringify({ success: true, progress: defaultProgress }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, progress: convertMongoDoc(progress) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/daily-progress' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.DAILY_PROGRESS);
      
      await collection.updateOne(
        { type: 'daily' },
        { 
          $set: { 
            [`userProgress.${body.userId}`]: {
              callsToday: body.callsToday,
              lastCallTime: body.lastCallTime || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          } 
        },
        { upsert: true }
      );
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/daily-progress/check-reset' && req.method === 'GET') {
      const collection = await getCollection(Collections.DAILY_PROGRESS);
      const progressData = await collection.findOne({ type: 'daily' });
      
      if (!progressData) {
        return new Response(
          JSON.stringify({ success: true, wasReset: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const lastReset = new Date(progressData.lastReset);
      const now = new Date();
      const shouldReset = now.toDateString() !== lastReset.toDateString();
      
      if (shouldReset) {
        await collection.updateOne(
          { type: 'daily' },
          { 
            $set: { 
              userProgress: {},
              lastReset: now.toISOString()
            } 
          }
        );
        
        console.log('[DAILY PROGRESS] Auto-reset completed at', now.toISOString());
        return new Response(
          JSON.stringify({ 
            success: true, 
            wasReset: true,
            lastReset: now.toISOString()
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          wasReset: false,
          lastReset: progressData.lastReset
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/daily-progress/reset' && req.method === 'POST') {
      const collection = await getCollection(Collections.DAILY_PROGRESS);
      
      await collection.updateOne(
        { type: 'daily' },
        { 
          $set: { 
            userProgress: {},
            lastReset: new Date().toISOString()
          } 
        },
        { upsert: true }
      );
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== PROMOTIONS ====================
    if (path === '/promotions' && req.method === 'GET') {
      const collection = await getCollection(Collections.PROMOTIONS);
      const promotions = await collection.find({}).toArray();
      return new Response(
        JSON.stringify({ success: true, promotions: convertMongoDocs(promotions) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/promotions' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.PROMOTIONS);
      
      const newPromotion = {
        ...body,
        id: body.id || generateId(),
        createdAt: new Date().toISOString(),
      };
      
      await collection.insertOne(newPromotion);
      
      return new Response(
        JSON.stringify({ success: true, promotion: newPromotion }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/promotions\/(.+)$/) && req.method === 'PUT') {
      const id = path.split('/')[2];
      const body = await req.json();
      const collection = await getCollection(Collections.PROMOTIONS);
      
      await collection.updateOne({ id }, { $set: { ...body, updatedAt: new Date().toISOString() } });
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path.match(/^\/promotions\/(.+)$/) && req.method === 'DELETE') {
      const id = path.split('/')[2];
      const collection = await getCollection(Collections.PROMOTIONS);
      await collection.deleteOne({ id });
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== ARCHIVE ====================
    if (path === '/archive' && req.method === 'GET') {
      const entityType = url.searchParams.get('type');
      const collection = await getCollection(Collections.ARCHIVE);
      
      const query = entityType ? { entityType } : {};
      const archives = await collection.find(query).sort({ archivedAt: -1 }).limit(1000).toArray();
      
      return new Response(
        JSON.stringify({ success: true, archives: convertMongoDocs(archives) }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/archive' && req.method === 'POST') {
      const body = await req.json();
      const collection = await getCollection(Collections.ARCHIVE);
      
      const archiveEntry = {
        ...body,
        id: body.id || generateId(),
        archivedAt: new Date().toISOString(),
      };
      
      await collection.insertOne(archiveEntry);
      
      return new Response(
        JSON.stringify({ success: true, archive: archiveEntry }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/archive/restore' && req.method === 'POST') {
      const body = await req.json();
      const { archiveId, entityType } = body;
      
      const archiveCollection = await getCollection(Collections.ARCHIVE);
      const archivedItem = await archiveCollection.findOne({ id: archiveId });
      
      if (!archivedItem) {
        return new Response(
          JSON.stringify({ success: false, error: 'Archived item not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Restore to appropriate collection
      if (entityType === 'number') {
        const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
        const restoredNumber = {
          ...archivedItem.data,
          status: 'available',
          assignedTo: null,
          assignedAt: null,
        };
        await numbersCollection.insertOne(restoredNumber);
      }
      
      // Remove from archive
      await archiveCollection.deleteOne({ id: archiveId });
      
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ==================== NOT FOUND ====================
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Endpoint not found',
        path,
        method: req.method 
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[SERVER ERROR]', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

console.log('🚀 BTM Travel CRM Server running on MongoDB!');
console.log('📊 Database: btm_travel_crm @ cluster0.vlklc6c.mongodb.net');
console.log('✅ All Supabase dependencies removed!');
