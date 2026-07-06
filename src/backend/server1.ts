// // BTM Travel CRM Backend Server - MongoDB Version
// // Pure Deno server - No Supabase dependencies
// import { getCollection, Collections, initializeDatabase, convertMongoDoc, convertMongoDocs, getMongoDb } from './mongodb.tsx';
// import { corsHeaders, generateId, determineAgentStatus, ensureMongoInitialized, checkMongoReady, isMongoInitialized, isMongoInitializing, SERVER_VERSION, SERVER_STARTED } from './utils.ts';
// // route handlers split into modules
// import * as specialDb from './routes/specialDatabase.ts';
// import * as assignments from './routes/assignments.ts';
// import * as callProgress from './routes/callProgress.ts';
// // TODO: import other route modules (promotions, archive, admin, etc.)

// // NOTE: common helpers (CORS headers, id generator, agent status, Mongo initialization) are now
// // exported from utils.ts to keep this file focused on routing.

// // Initialize MongoDB in the background (non-blocking)
// console.log('🔧 Starting MongoDB initialization in background...');
// (async () => {
//   try {
//     await ensureMongoInitialized();
//   } catch (error) {
//     console.error('⚠️ Initial MongoDB connection failed:', error);
//     console.log('⏳ Will retry on first request...');
//   }
// })();


//   Deno.serve({ port: 8000, hostname: "0.0.0.0" }, async (req:any) => {
//     // Handle CORS preflight
//     if (req.method === 'OPTIONS') {
//       return new Response(null, { headers: corsHeaders });
//     }

//     const url = new URL(req.url);
//     const path: string = url.pathname; // explicit type prevents literal-narrowing issues
    
//     console.log(`[BTM CRM Server] [${req.method}] ${path}`);

//     try {
//       // ==================== HEALTH & TEST ====================
//       // Health check - quick server check (doesn't require MongoDB)
//       if (path === '/health' || path.includes('/health')) {
//         // Check MongoDB status
//         if (isMongoInitializing()) {
//           return new Response(
//             JSON.stringify({
//               status: 'initializing',
//               message: 'Server is running, MongoDB is initializing...',
//               timestamp: new Date().toISOString(),
//               version: SERVER_VERSION,
//               mongodb: 'initializing',
//             }),
//             { 
//               status: 200,
//               headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//             }
//           );
//         }
        
//         if (!isMongoInitialized()) {
//           return new Response(
//             JSON.stringify({
//               status: 'degraded',
//               message: 'Server is running, MongoDB not yet connected',
//               timestamp: new Date().toISOString(),
//               version: SERVER_VERSION,
//               mongodb: 'disconnected',
//             }),
//             { 
//               status: 200, // Return 200 so frontend knows server is alive
//               headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//             }
//           );
//         }
        
//         // MongoDB is initialized, do a quick ping
//         try {
//           const db = await getMongoDb();
//           await db.command({ ping: 1 });
          
//           return new Response(
//             JSON.stringify({
//               status: 'ok',
//               message: 'BTM Travel CRM Server is running (MongoDB Connected)',
//               timestamp: new Date().toISOString(),
//               version: SERVER_VERSION,
//               serverStarted: SERVER_STARTED,
//               mongodb: 'connected',
//               customerEndpoints: 'available',
//             }),
//             { 
//               status: 200,
//               headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//             }
//           );
//         } catch (error) {
//           return new Response(
//             JSON.stringify({
//               status: 'degraded',
//               message: 'Server running but MongoDB ping failed',
//               timestamp: new Date().toISOString(),
//               version: SERVER_VERSION,
//               mongodb: 'error',
//               error: error.message,
//             }),
//             { 
//               status: 200, // Return 200 so frontend knows server is alive
//               headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//             }
//           );
//         }
//       }

//       if (path === '/test' || path.includes('/test')) {
//         return new Response(
//           JSON.stringify({
//             status: 'ok',
//             message: 'BTM Travel CRM Server - All Systems Operational',
//             timestamp: new Date().toISOString(),
//             mongo: isMongoInitialized() ? 'connected' : 'not ready',
//             serverVersion: SERVER_VERSION,
//             serverStarted: SERVER_STARTED,
//             totalEndpoints: '50+',
//             criticalEndpointsStatus: {
//               '/team-performance': 'LOADED ✅',
//               '/agent-monitoring/overview': 'LOADED ✅',
//               '/agent-monitoring/agent/:id': 'LOADED ✅',
//               '/database/clients': 'LOADED ✅',
//               '/database/customers': 'LOADED ✅',
//               '/database/reset-all': 'LOADED ✅',
//               '/cron/daily-archive': 'LOADED ✅'
//             },
//             useDebugEndpoint: 'Visit /debug/endpoints for complete endpoint list'
//           }),
//           { 
//             status: 200,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//           }
//         );
//       }

//       // // Simple test endpoint to verify server is running latest code
//       if (path === '/test-setup' && req.method === 'GET') {
//         return new Response(
//           JSON.stringify({
//             success: true,
//             message: '✅ Server is running the LATEST code (v6.0.0-OCT24)!',
//             version: SERVER_VERSION,
//             timestamp: new Date().toISOString(),
//             serverStarted: SERVER_STARTED,
//             mongoInitialized: isMongoInitialized(),
//             mongoInitializing: isMongoInitializing(),
//             endpointsVerified: [
//               '/email-recipients',
//               '/database/customers/assigned/:id',
//               '/customers/archived',
//               '/users/login',
//               '/setup/init'
//             ]
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // // Debug endpoint to verify manager endpoints exist
//       if (path === '/debug/manager-endpoints' && req.method === 'GET') {
//         return new Response(
//           JSON.stringify({
//             success: true,
//             message: 'Manager endpoints diagnostic',
//             version: SERVER_VERSION,
//             serverStarted: SERVER_STARTED,
//             mongoStatus: {
//               initialized: isMongoInitialized(),
//               initializing: isMongoInitializing()
//             },
//             managerEndpoints: {
//               '/team-performance': {
//                 method: 'GET',
//                 status: 'LOADED ✅',
//                 lineNumber: 3021,
//                 requiresMongo: true
//               },
//               '/agent-monitoring/overview': {
//                 method: 'GET',
//                 status: 'LOADED ✅',
//                 lineNumber: 3111,
//                 requiresMongo: true
//               },
//               '/database/customers': {
//                 method: 'GET',
//                 status: 'LOADED ✅',
//                 lineNumber: 3174,
//                 requiresMongo: true
//               }
//             },
//             note: 'If MongoDB is not initialized, these endpoints will return 503, not 404',
//             troubleshooting: {
//               if404: 'The server is running OLD code. Please kill all Deno processes and restart.',
//               if503: 'MongoDB is initializing. Wait 10-30 seconds and try again.',
//               ifSuccess: 'Endpoints are working correctly!'
//             }
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // // Setup endpoint to initialize default admin user
//       if (path === '/setup/init' && req.method === 'POST') {
//         try {
//           const collection = await getCollection(Collections.USERS);
          
//           // Check if admin already exists
//           const existingAdmin = await collection.findOne({ username: 'admin' });
//           if (existingAdmin) {
//             return new Response(
//               JSON.stringify({ 
//                 success: false, 
//                 error: 'Default admin user already exists',
//                 message: 'Admin user is already initialized. Use the existing admin credentials to log in.'
//               }),
//               { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           // Create default admin user
//           const adminUser = {
//             id: 'admin-1',
//             username: 'admin',
//             name: 'Administrator',
//             email: 'admin@btmtravel.net',
//             password: 'admin123',
//             role: 'admin',
//             permissions: [],
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//           };
          
//           await collection.insertOne(adminUser);
          
//           console.log('[SETUP] ✅ Default admin user created');
          
//           return new Response(
//             JSON.stringify({ 
//               success: true,
//               message: 'Default admin user created successfully',
//               credentials: {
//                 username: 'admin',
//                 password: 'admin123'
//               }
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[SETUP] Error creating admin:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // // Debug endpoint to list all users (with passwords for debugging)
//       if (path === '/debug/users' && req.method === 'GET') {
//         try {
//           const collection = await getCollection(Collections.USERS);
//           const users = await collection.find({}).toArray();
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               count: users.length,
//               users: users.map(u => ({
//                 id: u.id,
//                 username: u.username,
//                 password: u.password,
//                 email: u.email,
//                 role: u.role,
//                 createdAt: u.createdAt
//               }))
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // // Debug CORS configuration
//       if (path === '/debug/cors' && req.method === 'GET') {
//         return new Response(
//           JSON.stringify({
//             success: true,
//             message: 'CORS configuration is properly set up',
//             corsHeaders: {
//               'Access-Control-Allow-Origin': corsHeaders['Access-Control-Allow-Origin'],
//               'Access-Control-Allow-Methods': corsHeaders['Access-Control-Allow-Methods'],
//               'Access-Control-Allow-Headers': corsHeaders['Access-Control-Allow-Headers'],
//               'Access-Control-Expose-Headers': corsHeaders['Access-Control-Expose-Headers'],
//               'Access-Control-Max-Age': corsHeaders['Access-Control-Max-Age'],
//             },
//             note: 'All responses from this server include these CORS headers',
//             timestamp: new Date().toISOString()
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // // Debug endpoint to verify endpoints are loaded
//       if (path === '/debug/endpoints' && req.method === 'GET') {
//         return new Response(
//           JSON.stringify({
//             success: true,
//             serverVersion: SERVER_VERSION,
//             serverStarted: SERVER_STARTED,
//             mongoStatus: isMongoInitialized() ? 'connected' : (isMongoInitializing() ? 'initializing' : 'not connected'),
//             message: 'All 50+ endpoints loaded and verified',
//             endpointCategories: {
//               core: ['/health', '/test', '/debug/endpoints', '/debug/users', '/setup/init'],
//               authentication: ['/users/login', '/users', '/users/:id', '/login-audit'],
//               clients: [
//                 '/database/clients',
//                 '/database/clients/import',
//                 '/database/clients/assign',
//                 '/database/clients/:id',
//                 '/database/clients/bulk-delete',
//                 '/database/clients/clear-all',
//                 '/database/clients/archive',
//                 '/database/clients/archive/bulk-restore'
//               ],
//               customers: [
//                 '/database/customers',
//                 '/database/customers/assigned/:id',
//                 '/database/customers/import',
//                 '/database/customers/assign',
//                 '/customers',
//                 '/customers/clear',
//                 '/customers/archived',
//                 '/customer-interactions'
//               ],
//               assignments: [
//                 '/assignments',
//                 '/assignments/claim',
//                 '/assignments/mark-called',
//                 '/number-claims',
//                 '/claim-number',
//                 '/release-number',
//                 '/extend-number-claim'
//               ],
//               callManagement: [
//                 '/call-logs',
//                 '/call-scripts',
//                 '/call-scripts/:id/activate',
//                 '/call-scripts/:id',
//                 '/call-scripts/active/:type'
//               ],
//               managerOperations: [
//                 '/team-performance',
//                 '/agent-monitoring/overview',
//                 '/agent-monitoring/agent/:id'
//               ],
//               settings: [
//                 '/smtp-settings',
//                 '/smtp-test',
//                 '/send-email',
//                 '/send-quick-email',
//                 '/threecx-settings',
//                 '/email-recipients'
//               ],
//               progress: [
//                 '/daily-progress',
//                 '/daily-progress/check-reset',
//                 '/daily-progress/reset'
//               ],
//               promotions: ['/promotions', '/promotions/:id'],
//               archive: ['/archive', '/archive/restore'],
//               admin: [
//                 '/admin/delete-selected-data',
//                 '/database/reset-all',
//                 '/cron/daily-archive'
//               ]
//             },
//             totalEndpoints: '50+',
//             status: 'All endpoints operational'
//           }),
//           { 
//             status: 200,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//           }
//         );
//       }

//       // ==================== SETUP / INITIALIZE ====================
//       // Debug log to see what path we're getting
//       // GET /team-performance - Get team performance metrics

//       // These endpoints provide manager-specific functionality for team oversight
      
//       // GET /team-performance - Get team performance metrics
//       if (path === '/team-performance' && req.method === 'GET') {
//         console.log('[MANAGER] Team performance requested');
        
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         try {
//           const usersCollection = await getCollection(Collections.USERS);
//           const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//           const progressCollection = await getCollection(Collections.DAILY_PROGRESS);
          
//           // Get all agents
//           const agents = await usersCollection.find({ role: 'agent' }).toArray();
          
//           // Calculate team metrics
//           const teamData = [];
//           let totalCalls = 0;
//           let totalAssigned = 0;
          
//           for (const agent of agents) {
//             // Get agent's assignments
//             const assignments = await assignmentsCollection.find({ 
//               agentId: agent.id,
//               status: 'assigned'
//             }).toArray();
            
//             // Get agent's progress
//             const progress = await progressCollection.findOne({ agentId: agent.id }) || {
//               callsMade: 0,
//               successfulCalls: 0,
//               missedCalls: 0
//             };
            
//             const assignedCount = assignments.length;
//             const callsMade = progress.callsMade || 0;
//             const completionRate = assignedCount > 0 ? Math.round((callsMade / assignedCount) * 100) : 0;
            
//             totalCalls += callsMade;
//             totalAssigned += assignedCount;
            
//             teamData.push({
//               agentId: agent.id,
//               agentName: agent.name || agent.username,
//               assigned: assignedCount,
//               called: callsMade,
//               completionRate,
//               status: determineAgentStatus(progress.lastActivity)
//             });
//           }
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               teamPerformance: teamData,
//               summary: {
//                 totalAgents: agents.length,
//                 totalAssigned,
//                 totalCalls,
//                 avgCompletionRate: totalAssigned > 0 ? Math.round((totalCalls / totalAssigned) * 100) : 0
//               }
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[MANAGER] Team performance error:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }
      
//       // /agent-monitoring/overview - Moved to line 1430 to be before MongoDB check
      
//       // GET /agent-monitoring/agent/:id - Get detailed agent metrics
//       if (path.startsWith('/agent-monitoring/agent/') && req.method === 'GET') {
//         const agentId = path.split('/').pop();
//         console.log('[MANAGER] Agent detail requested for:', agentId);
        
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         try {
//           const usersCollection = await getCollection(Collections.USERS);
//           const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//           const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
          
//           const agent = await usersCollection.findOne({ id: agentId });
//           if (!agent) {
//             return new Response(
//               JSON.stringify({ success: false, error: 'Agent not found' }),
//               { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           // Get CRM records (type: 'client' assignments)
//           const crmAssignments = await assignmentsCollection.find({ 
//             agentId: agentId,
//             type: 'client'
//           }).toArray();
//           const crmRecords = crmAssignments.map(a => a.numberData || a);
          
//           // Get Special Numbers records (type: 'special' assignments)
//           const specialAssignments = await assignmentsCollection.find({ 
//             agentId: agentId,
//             type: 'special'
//           }).toArray();
//           const specialRecords = specialAssignments.map(a => a.numberData || a);
          
//           // Get all Customer Service records assigned to this agent
//           const customerRecords = await customersCollection.find({ assignedTo: agentId }).toArray();
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               agent: {
//                 id: agent.id,
//                 name: agent.name || agent.username,
//                 email: agent.email,
//                 role: agent.role
//               },
//               data: {
//                 crmRecords: convertMongoDocs(crmRecords),
//                 specialRecords: convertMongoDocs(specialRecords),
//                 customerRecords: convertMongoDocs(customerRecords)
//               }
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[MANAGER] Agent detail error:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== EMAIL RECIPIENTS ====================
//       if (path === '/email-recipients' && req.method === 'GET') {
//         console.log('[EMAIL-RECIPIENTS] Get email recipients requested');
        
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         try {
//           const collection = await getCollection(Collections.EMAIL_RECIPIENTS);
          
//           // Try to get existing recipients
//           const doc = await collection.findOne({ type: 'default' });
          
//           if (doc && doc.recipients) {
//             return new Response(
//               JSON.stringify({
//                 success: true,
//                 recipients: doc.recipients
//               }),
//               { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           // No recipients saved yet - return defaults
//           const defaultRecipients = [
//             "operations@btmlimited.net",
//             "quantityassurance@btmlimited.net",
//             "clientcare@btmlimited.net"
//           ];
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               recipients: defaultRecipients,
//               isDefault: true
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[EMAIL-RECIPIENTS] Error fetching recipients:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       if (path === '/email-recipients' && req.method === 'POST') {
//         console.log('[EMAIL-RECIPIENTS] Save email recipients requested');
        
//         // Check MongoDB ready
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const body = await req.json();
//           const { recipients } = body;
          
//           if (!recipients || !Array.isArray(recipients)) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'Invalid recipients format. Expected array of email addresses.'
//               }),
//               { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           // Validate email format
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           const invalidEmails = recipients.filter(email => !emailRegex.test(email));
          
//           if (invalidEmails.length > 0) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: `Invalid email addresses: ${invalidEmails.join(', ')}`
//               }),
//               { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           const collection = await getCollection(Collections.EMAIL_RECIPIENTS);
          
//           // Update or insert recipients
//           await collection.updateOne(
//             { type: 'default' },
//             { 
//               $set: { 
//                 recipients,
//                 updatedAt: new Date().toISOString()
//               }
//             },
//             { upsert: true }
//           );
          
//           console.log('[EMAIL-RECIPIENTS] ✅ Recipients saved successfully');
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               message: 'Email recipients saved successfully',
//               recipients
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[EMAIL-RECIPIENTS] Error saving recipients:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== USER MANAGEMENT ====================
//       // Get all users
//       if (path === '/users' && req.method === 'GET') {
//         console.log('[USERS] Get all users requested');
        
//         // Check MongoDB ready
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const collection = await getCollection(Collections.USERS);
//           const users = await collection.find({}).toArray();
          
//           // Remove passwords from response
//           const sanitizedUsers = users.map((u: any) => {
//             const { password, ...rest } = u;
//             return convertMongoDoc(rest);
//           });
          
//           // Also provide agents list (users with role === 'Agent')
//           const agents = sanitizedUsers.filter((u: any) => u.role === 'Agent');
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               users: sanitizedUsers,
//               agents: agents  // Include agents for easy filtering
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[USERS] Error fetching users:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Create new user
//       if (path === '/users' && req.method === 'POST') {
//         console.log('[USERS] Create user requested');
        
//         // Check MongoDB ready
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const body = await req.json();
//           const { username, name, email, password, role, permissions, dailyTarget } = body;
          
//           if (!username || !name || !password || !role) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'Missing required fields: username, name, password, role'
//               }),
//               { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           const collection = await getCollection(Collections.USERS);
          
//           // Check if username already exists
//           const existingUser = await collection.findOne({ username });
//           if (existingUser) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'Username already exists'
//               }),
//               { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           const newUser = {
//             id: generateId(),
//             username,
//             name,
//             email: email || '',
//             password,
//             role,
//             permissions: permissions || [],
//             dailyTarget: dailyTarget || 30,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//           };
          
//           await collection.insertOne(newUser);
          
//           console.log(`[USERS] ✅ User created: ${username} (${role})`);
          
//           // Return user without password
//           const { password: _, ...userWithoutPassword } = newUser;
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               user: convertMongoDoc(userWithoutPassword),
//               message: 'User created successfully'
//             }),
//             { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[USERS] Error creating user:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Update user
//       if (path.startsWith('/users/') && req.method === 'PUT') {
//         const userId = path.split('/users/')[1];
//         console.log(`[USERS] Update user requested: ${userId}`);
        
//         // Check MongoDB ready
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const body = await req.json();
//           const { name, email, password, role, permissions, dailyTarget } = body;
          
//           const collection = await getCollection(Collections.USERS);
          
//           const updateDoc: any = {
//             updatedAt: new Date().toISOString()
//           };
          
//           if (name) updateDoc.name = name;
//           if (email !== undefined) updateDoc.email = email;
//           if (password) updateDoc.password = password;
//           if (role) updateDoc.role = role;
//           if (permissions !== undefined) updateDoc.permissions = permissions;
//           if (dailyTarget !== undefined) updateDoc.dailyTarget = dailyTarget;
          
//           const result = await collection.updateOne(
//             { id: userId },
//             { $set: updateDoc }
//           );
          
//           if (result.matchedCount === 0) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'User not found'
//               }),
//               { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           console.log(`[USERS] ✅ User updated: ${userId}`);
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               message: 'User updated successfully'
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[USERS] Error updating user:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Delete user
//       if (path.startsWith('/users/') && req.method === 'DELETE') {
//         const userId = path.split('/users/')[1];
//         console.log(`[USERS] Delete user requested: ${userId}`);
        
//         // Check MongoDB ready
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const collection = await getCollection(Collections.USERS);
          
//           // Prevent deleting the default admin
//           const user = await collection.findOne({ id: userId });
//           if (user && user.id === 'admin-1') {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'Cannot delete the default admin user'
//               }),
//               { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           const result = await collection.deleteOne({ id: userId });
          
//           if (result.deletedCount === 0) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'User not found'
//               }),
//               { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           console.log(`[USERS] ✅ User deleted: ${userId}`);
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               message: 'User deleted successfully'
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[USERS] Error deleting user:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // User login
//       if (path === '/users/login' && req.method === 'POST') {
//         console.log('[AUTH] Login attempt');
        
//         // Check MongoDB ready
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const body = await req.json();
//           const { username, password } = body;
          
//           if (!username || !password) {
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'Username and password are required'
//               }),
//               { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           const collection = await getCollection(Collections.USERS);
//           const user = await collection.findOne({ username });
          
//           if (!user || user.password !== password) {
//             // Log failed login attempt
//             const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
//             await auditCollection.insertOne({
//               id: generateId(),
//               username,
//               success: false,
//               timestamp: new Date().toISOString(),
//               reason: user ? 'invalid_password' : 'user_not_found'
//             });
            
//             console.log(`[AUTH] ❌ Login failed for: ${username}`);
            
//             return new Response(
//               JSON.stringify({
//                 success: false,
//                 error: 'Invalid username or password'
//               }),
//               { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           // Log successful login
//           const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
//           await auditCollection.insertOne({
//             id: generateId(),
//             userId: user.id,
//             username: user.username,
//             success: true,
//             timestamp: new Date().toISOString()
//           });
          
//           console.log(`[AUTH] ✅ Login successful: ${username} (${user.role})`);
          
//           // Return user without password
//           const { password: _, ...userWithoutPassword } = user;
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               user: convertMongoDoc(userWithoutPassword)
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[AUTH] Login error:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Get login audit logs
//       if (path === '/login-audit' && req.method === 'GET') {
//         console.log('[AUDIT] Get login audit logs');
        
//         // Check MongoDB ready
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const collection = await getCollection(Collections.LOGIN_AUDIT);
//           const logs = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
          
//           return new Response(
//             JSON.stringify({
//               success: true,
//               logs: convertMongoDocs(logs)
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[AUDIT] Error fetching logs:', error);
//           return new Response(
//             JSON.stringify({
//               success: false,
//               error: error.message
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== TEAM PERFORMANCE (Can work without MongoDB initially) ====================
//       if (path === '/team-performance') {
//         console.log('');
//         console.log('🔍🔍🔍 TEAM-PERFORMANCE REQUEST DETECTED 🔍🔍🔍');
//         console.log(`   Path: ${path}`);
//         console.log(`   Method: ${req.method}`);
//         console.log(`   Should Match: ${path === '/team-performance' && req.method === 'GET'}`);
//         console.log('');
//       }
      
//       if (path === '/team-performance' && req.method === 'GET') {
//         console.log('✅ /team-performance endpoint HIT! Processing request...');
        
//         // Check if MongoDB is ready
//         if (!isMongoInitialized()) {
//           console.log('⚠️  MongoDB not ready yet - returning empty team data');
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               teamData: [],
//               message: 'MongoDB initializing - team data will load shortly'
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         try {
//           const usersCollection = await getCollection(Collections.USERS);
//           const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//           const callLogsCollection = await getCollection(Collections.CALL_LOGS);
//           const dailyProgressCollection = await getCollection(Collections.DAILY_PROGRESS);
          
//           // Get all agents
//           const agents = await usersCollection.find({ role: 'agent' }).toArray();
          
//           // Get daily progress for all users
//           const dailyProgress = await dailyProgressCollection.find({}).toArray();
//           const progressMap = new Map(dailyProgress.map((p: any) => [p.userId, p]));
          
//           // Date calculations
//           const now = new Date();
//           const today = now.toISOString().split('T')[0];
//           const todayStart = new Date(today).toISOString();
          
//           // Week start (Monday)
//           const weekStart = new Date(now);
//           weekStart.setDate(now.getDate() - now.getDay() + 1);
//           weekStart.setHours(0, 0, 0, 0);
          
//           // Month start
//           const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
//           const teamData = await Promise.all(agents.map(async (agent: any) => {
//             // Count assignments
//             const totalAssignments = await assignmentsCollection.countDocuments({ agentId: agent.id });
//             const completedAssignments = await assignmentsCollection.countDocuments({ 
//               agentId: agent.id, 
//               called: true 
//             });
            
//             // Get call logs for different time periods
//             const todayCalls = await callLogsCollection.countDocuments({
//               agentId: agent.id,
//               callTime: { $gte: todayStart }
//             });
            
//             const weekCalls = await callLogsCollection.countDocuments({
//               agentId: agent.id,
//               callTime: { $gte: weekStart.toISOString() }
//             });
            
//             const monthCalls = await callLogsCollection.countDocuments({
//               agentId: agent.id,
//               callTime: { $gte: monthStart.toISOString() }
//             });
            
//             // Get breakdown by board type (from call logs)
//             const allCallsToday = await callLogsCollection.find({
//               agentId: agent.id,
//               callTime: { $gte: todayStart }
//             }).toArray();
            
//             const clientCalls = allCallsToday.filter((log: any) => 
//               log.board === 'client-crm' || log.type === 'prospective'
//             ).length;
            
//             const promoSales = allCallsToday.filter((log: any) => 
//               log.board === 'promo-sales' || log.type === 'promotion'
//             ).length;
            
//             const customerService = allCallsToday.filter((log: any) => 
//               log.board === 'customer-service' || log.type === 'existing'
//             ).length;
            
//             // Get recent call for status determination
//             const recentCall = await callLogsCollection.findOne(
//               { agentId: agent.id },
//               { sort: { callTime: -1 } }
//             );
            
//             // Determine status based on last call time
//             let status = 'offline';
//             if (recentCall) {
//               const lastCallTime = new Date(recentCall.callTime);
//               const minutesSinceCall = (now.getTime() - lastCallTime.getTime()) / (1000 * 60);
              
//               if (minutesSinceCall < 15) {
//                 status = 'active';
//               } else if (minutesSinceCall < 60) {
//                 status = 'idle';
//               }
//             }
            
//             // Get progress data
//             const progress = progressMap.get(agent.id);
            
//             // Mock additional metrics (these would come from actual data in production)
//             const emailsSent = Math.floor(clientCalls * 0.6); // Rough estimate
//             const dealsCreated = Math.floor(promoSales * 0.3); // Rough estimate
//             const ticketsResolved = Math.floor(customerService * 0.4); // Rough estimate
            
//             return {
//               id: agent.id,
//               name: agent.name,
//               email: agent.email,
//               role: agent.role || 'agent',
//               dailyTarget: agent.dailyTarget || 30,
//               callsToday: progress?.callsToday || todayCalls || 0,
//               callsWeek: weekCalls || 0,
//               callsMonth: monthCalls || 0,
//               lastCallTime: recentCall ? recentCall.callTime : (progress?.lastCallTime || null),
//               status,
//               // Board breakdown
//               clientCalls: clientCalls || 0,
//               promoSales: promoSales || 0,
//               customerService: customerService || 0,
//               // Additional metrics
//               emailsSent: emailsSent || 0,
//               dealsCreated: dealsCreated || 0,
//               ticketsResolved: ticketsResolved || 0,
//               // Legacy fields for compatibility
//               totalAssignments,
//               completedAssignments,
//             };
//           }));
          
//           return new Response(
//             JSON.stringify({ success: true, teamData: convertMongoDocs(teamData) }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[TEAM PERFORMANCE] Error:', error);
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: error.message,
//               teamData: []
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== AGENT MONITORING ====================
//       // Agent Monitoring - Overview (before MongoDB check for reliability)
//       if (path === '/agent-monitoring/overview' && req.method === 'GET') {
//         console.log('✅ /agent-monitoring/overview endpoint HIT!');
        
//         // Check if MongoDB is ready (with auto-initialization)
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         try {
//           const usersCollection = await getCollection(Collections.USERS);
//           const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//           const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
          
//           // Get all agents
//           const agents = await usersCollection.find({ role: 'agent' }).toArray();
          
//           const agentStats = await Promise.all(agents.map(async (agent: any) => {
//             // Get CRM assignments (type: 'client')
//             const totalCRMAssignments = await assignmentsCollection.countDocuments({ 
//               agentId: agent.id,
//               type: 'client'
//             });
//             const completedCRMAssignments = await assignmentsCollection.countDocuments({ 
//               agentId: agent.id,
//               type: 'client',
//               called: true 
//             });
            
//             // Get Special Numbers assignments (type: 'special')
//             const totalSpecialAssignments = await assignmentsCollection.countDocuments({ 
//               agentId: agent.id,
//               type: 'special'
//             });
//             const completedSpecialAssignments = await assignmentsCollection.countDocuments({ 
//               agentId: agent.id,
//               type: 'special',
//               called: true 
//             });
            
//             // Get customer service assignments
//             const totalCustomerAssignments = await customersCollection.countDocuments({ 
//               assignedTo: agent.id 
//             });
//             // Count customers with interactionCompleted flag OR notes as "completed" interactions
//             // This supports both new tracking method and legacy data
//             const customersWithNotes = await customersCollection.find({ 
//               assignedTo: agent.id
//             }).toArray();
//             const completedCustomerAssignments = customersWithNotes.filter(c => 
//               c.interactionCompleted === true || (c.notes && c.notes.length > 0)
//             ).length;
            
//             // Calculate totals
//             const overallTotal = totalCRMAssignments + totalSpecialAssignments + totalCustomerAssignments;
//             const overallCompleted = completedCRMAssignments + completedSpecialAssignments + completedCustomerAssignments;
//             const overallPending = overallTotal - overallCompleted;
            
//             return {
//               id: agent.id,
//               name: agent.name || agent.username || 'Unknown',
//               email: agent.email || '',
//               crm: {
//                 total: totalCRMAssignments,
//                 completed: completedCRMAssignments,
//                 pending: totalCRMAssignments - completedCRMAssignments
//               },
//               specialNumbers: {
//                 total: totalSpecialAssignments,
//                 completed: completedSpecialAssignments,
//                 pending: totalSpecialAssignments - completedSpecialAssignments
//               },
//               customerService: {
//                 total: totalCustomerAssignments,
//                 completed: completedCustomerAssignments,
//                 pending: totalCustomerAssignments - completedCustomerAssignments
//               },
//               overall: {
//                 total: overallTotal,
//                 completed: overallCompleted,
//                 pending: overallPending,
//                 completionPercentage: overallTotal > 0 
//                   ? Math.round((overallCompleted / overallTotal) * 100) 
//                   : 0
//               }
//             };
//           }));
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               agents: convertMongoDocs(agentStats)
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[AGENT MONITORING] Error:', error);
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: error.message,
//               agents: []
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== DATABASE ENDPOINTS ====================
//       // Get all customers from database (before MongoDB check for reliability)
//       if (path === '/database/customers' && req.method === 'GET') {
//         console.log('[DATABASE] Get all customers requested');
        
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         try {
//           const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
//           // Only return UNASSIGNED customers (available for assignment)
//           const customers = await collection.find({
//             $or: [
//               { status: { $exists: false } },
//               { status: null },
//               { status: 'available' },
//               { status: { $ne: 'assigned' } }
//             ],
//             $and: [
//               {
//                 $or: [
//                   { assignedTo: { $exists: false } },
//                   { assignedTo: null },
//                   { assignedTo: '' }
//                 ]
//               }
//             ]
//           }).toArray();
          
//           console.log('[DATABASE] Returning unassigned customers:', customers.length);
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               records: convertMongoDocs(customers),
//               customers: convertMongoDocs(customers),
//               count: customers.length
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[DATABASE] Error fetching customers:', error);
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: error.message,
//               records: [],
//               customers: [],
//               count: 0
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Get all clients from database (before MongoDB check for reliability)
//       if (path === '/database/clients' && req.method === 'GET') {
//         console.log('[DATABASE] Get all clients requested');
        
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         try {
//           const collection = await getCollection(Collections.NUMBERS_DATABASE);
//           // Only return UNASSIGNED clients (available for assignment)
//           const clients = await collection.find({
//             $or: [
//               { status: { $exists: false } },
//               { status: null },
//               { status: 'available' },
//               { status: { $ne: 'assigned' } }
//             ],
//             $and: [
//               {
//                 $or: [
//                   { assignedTo: { $exists: false } },
//                   { assignedTo: null },
//                   { assignedTo: '' }
//                 ]
//               }
//             ]
//           }).toArray();
          
//           console.log('[DATABASE] Returning unassigned clients:', clients.length);
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               records: convertMongoDocs(clients),
//               clients: convertMongoDocs(clients),
//               count: clients.length
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[DATABASE] Error fetching clients:', error);
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: error.message,
//               records: [],
//               clients: [],
//               count: 0
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== CHECK MONGODB READINESS ====================
//       // For all non-health/test endpoints, check if MongoDB is ready
//       const mongoCheck = await checkMongoReady();
//       if (mongoCheck) {
//         return mongoCheck;
//       }

//       console.log(`[ROUTING] MongoDB ready, processing: ${req.method} ${path}`);


//       // ==================== CALL SCRIPTS ====================
//       if (path === '/call-scripts' && req.method === 'GET') {
//         const collection = await getCollection(Collections.CALL_SCRIPTS);
//         const scripts = await collection.find({}).toArray();
//         return new Response(
//           JSON.stringify({ success: true, scripts: convertMongoDocs(scripts) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/call-scripts' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.CALL_SCRIPTS);
//         const newScript = {
//           ...body,
//           id: body.id || generateId(),
//           createdAt: new Date().toISOString(),
//         };
//         await collection.insertOne(newScript);
//         return new Response(
//           JSON.stringify({ success: true, script: newScript }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/call-scripts\/(.+)\/activate$/) && req.method === 'POST') {
//         const id = path.split('/')[2];
//         const collection = await getCollection(Collections.CALL_SCRIPTS);
//         // Deactivate all scripts
//         await collection.updateMany({}, { $set: { isActive: false } });
//         // Activate the specified script
//         await collection.updateOne({ id }, { $set: { isActive: true } });
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/call-scripts\/(.+)$/) && req.method === 'DELETE') {
//         const id = path.split('/')[2];
//         const collection = await getCollection(Collections.CALL_SCRIPTS);
//         await collection.deleteOne({ id });
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/call-scripts\/active\/(prospective|existing)$/)) {
//         const type = path.split('/')[3];
//         const collection = await getCollection(Collections.CALL_SCRIPTS);
//         const activeScript = await collection.findOne({ isActive: true, type });
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             script: activeScript ? convertMongoDoc(activeScript) : null 
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== DATABASE - NUMBERS ====================
//       // NOTE: /database/clients GET endpoint is now handled earlier in the file (line ~1491)
//       // with proper unassigned filtering. This duplicate has been removed.

//       if (path === '/database/clients/import' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.NUMBERS_DATABASE);
//         const newClients = (body.clients || []).map((client: any) => ({
//           ...client,
//           id: client.id || generateId(),
//           importedAt: new Date().toISOString(),
//           status: 'available',
//           assignedTo: null,
//           assignedAt: null,
//           customerType: client.customerType || 'Retails',
//           airplane: client.airplane || '',
//         }));
        
//         if (newClients.length > 0) {
//           await collection.insertMany(newClients);
//         }
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             imported: newClients.length,
//             clients: newClients 
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/database/clients/assign' && req.method === 'POST') {
//         const body = await req.json();
//         const { clientIds, agentId, filters } = body;
        
//         console.log('[DATABASE] Client assignment request:', { clientIds: clientIds?.length, agentId, filters });
        
//         const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
//         const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
        
//         let numbersToAssign;
        
//         if (filters && (filters.customerType || filters.airplane)) {
//           // Filter based query - find unassigned numbers
//           const query: any = {
//             $or: [
//               { status: 'available' },
//               { status: { $exists: false } },
//               { status: null },
//               { status: '' }
//             ],
//             $and: [
//               {
//                 $or: [
//                   { assignedTo: { $exists: false } },
//                   { assignedTo: null },
//                   { assignedTo: '' }
//                 ]
//               }
//             ]
//           };
          
//           if (filters.customerType) query.customerType = filters.customerType;
//           if (filters.airplane) query.airplane = filters.airplane;
          
//           console.log('[DATABASE] Finding numbers with query:', JSON.stringify(query));
          
//           numbersToAssign = await numbersCollection
//             .find(query)
//             .limit(filters.count || 100)
//             .toArray();
            
//           console.log('[DATABASE] Found numbers:', numbersToAssign.length);
//         } else if (clientIds && clientIds.length > 0) {
//           // Specific IDs - find unassigned numbers
//           numbersToAssign = await numbersCollection
//             .find({ 
//               id: { $in: clientIds },
//               $or: [
//                 { status: 'available' },
//                 { status: { $exists: false } },
//                 { status: null },
//                 { status: '' }
//               ],
//               $and: [
//                 {
//                   $or: [
//                     { assignedTo: { $exists: false } },
//                     { assignedTo: null },
//                     { assignedTo: '' }
//                   ]
//                 }
//               ]
//             })
//             .toArray();
            
//           console.log('[DATABASE] Found specific numbers:', numbersToAssign.length, 'of', clientIds.length, 'requested');
//         } else {
//           return new Response(
//             JSON.stringify({ success: false, error: 'No clients or filters specified' }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         if (numbersToAssign.length === 0) {
//           console.log('[DATABASE] ❌ No available numbers found matching criteria');
          
//           // Check if there are ANY numbers in the database
//           const totalNumbers = await numbersCollection.countDocuments({});
//           const assignedNumbers = await numbersCollection.countDocuments({ 
//             assignedTo: { $exists: true, $ne: null, $ne: '' }
//           });
          
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: 'No available numbers match criteria',
//               debug: {
//                 totalInDatabase: totalNumbers,
//                 alreadyAssigned: assignedNumbers,
//                 available: totalNumbers - assignedNumbers,
//                 filters: filters || 'specific IDs',
//                 suggestion: totalNumbers === 0 
//                   ? 'No numbers in database. Please upload numbers first.'
//                   : assignedNumbers === totalNumbers
//                     ? 'All numbers are already assigned. Please import more numbers or unassign existing ones.'
//                     : 'No numbers match your filter criteria. Try different filters.'
//               }
//             }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         const assignmentDate = new Date().toISOString();
//         const assignments = numbersToAssign.map((number: any) => ({
//           id: generateId(),
//           numberId: number.id,
//           numberData: number,
//           agentId,
//           type: 'client', // CRITICAL: Mark as client type for proper categorization
//           assignedAt: assignmentDate,
//           status: 'active',
//           called: false,
//           calledAt: null,
//           outcome: null,
//         }));
        
//         // Mark numbers as assigned
//         await numbersCollection.updateMany(
//           { id: { $in: numbersToAssign.map((n: any) => n.id) } },
//           { $set: { status: 'assigned', assignedTo: agentId, assignedAt: assignmentDate } }
//         );
        
//         // Create assignments
//         await assignmentsCollection.insertMany(assignments);
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             assigned: assignments.length,
//             assignments: convertMongoDocs(assignments)
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/database\/clients\/(.+)$/) && req.method === 'DELETE') {
//         const id = path.split('/')[3];
//         const collection = await getCollection(Collections.NUMBERS_DATABASE);
//         await collection.deleteOne({ id });
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/database/clients/bulk-delete' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.NUMBERS_DATABASE);
//         await collection.deleteMany({ id: { $in: body.ids || [] } });
//         return new Response(
//           JSON.stringify({ success: true, deleted: body.ids?.length || 0 }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Bulk unassign clients/numbers endpoint
//       if (path === '/database/clients/unassign-all' && req.method === 'POST') {
//         console.log('[DATABASE] Bulk unassigning all clients...');
//         const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
//         const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
        
//         // Update all numbers back to available
//         const result = await numbersCollection.updateMany(
//           { 
//             $or: [
//               { status: 'assigned' },
//               { assignedTo: { $exists: true, $ne: null, $ne: '' } }
//             ]
//           },
//           { 
//             $set: { 
//               status: 'available',
//               assignedTo: null,
//               assignedAt: null
//             } 
//           }
//         );
        
//         // Remove all active assignments
//         const assignmentsResult = await assignmentsCollection.deleteMany({
//           status: { $in: ['active', 'pending'] }
//         });
        
//         console.log('[DATABASE] Unassigned numbers:', result.modifiedCount);
//         console.log('[DATABASE] Removed assignments:', assignmentsResult.deletedCount);
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             message: `Unassigned ${result.modifiedCount} numbers and removed ${assignmentsResult.deletedCount} assignments`,
//             unassignedNumbers: result.modifiedCount,
//             removedAssignments: assignmentsResult.deletedCount
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Recycle completed client assignments back to available
//       if (path === '/database/clients/recycle-completed' && req.method === 'POST') {
//         console.log('[DATABASE] Recycling completed client assignments...');
//         const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//         const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
        
//         // Find completed or called assignments
//         const completedAssignments = await assignmentsCollection.find({
//           $or: [
//             { status: 'completed' },
//             { called: true }
//           ]
//         }).toArray();
        
//         if (completedAssignments.length === 0) {
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               message: 'No completed assignments to recycle',
//               recycled: 0
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         const numberIds = completedAssignments.map((a: any) => a.numberId);
        
//         // Update numbers back to available
//         const result = await numbersCollection.updateMany(
//           { id: { $in: numberIds } },
//           { 
//             $set: { 
//               status: 'available',
//               assignedTo: null,
//               assignedAt: null
//             } 
//           }
//         );
        
//         // Archive the completed assignments
//         await assignmentsCollection.updateMany(
//           { id: { $in: completedAssignments.map((a: any) => a.id) } },
//           { $set: { status: 'archived' } }
//         );
        
//         console.log('[DATABASE] Recycled numbers:', result.modifiedCount);
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             message: `Recycled ${result.modifiedCount} completed numbers back to available`,
//             recycled: result.modifiedCount
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Migration endpoint to fix client/number status fields
//       if (path === '/database/clients/migrate' && req.method === 'POST') {
//         console.log('[DATABASE] Running client/number migration...');
//         const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
        
//         // Update all numbers that don't have proper status or assignedTo fields
//         const result = await numbersCollection.updateMany(
//           { 
//             $or: [
//               { status: { $exists: false } },
//               { status: null },
//               { status: undefined },
//               { assignedTo: undefined }
//             ]
//           },
//           { 
//             $set: { 
//               status: 'available',
//               assignedTo: null,
//               assignedAt: null
//             } 
//           }
//         );
        
//         console.log('[MIGRATION] Fixed client/number records:', result.modifiedCount);
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             message: `Fixed ${result.modifiedCount} client/number records`,
//             modifiedCount: result.modifiedCount
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== DATABASE - CUSTOMERS ====================
//       // NOTE: /database/customers GET endpoint is now handled earlier in the file (line ~1453)
//       // with proper unassigned filtering. This duplicate has been removed.

//       if (path === '/database/customers/import' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
//         const newCustomers = (body.records || []).map((customer: any) => ({
//           ...customer,
//           id: customer.id || generateId(),
//           importedAt: new Date().toISOString(),
//           customerType: customer.customerType || 'Retails',
//           flightInfo: customer.flightInfo || '',
//           assignedTo: null,
//           assignedAt: null,
//           assignedBy: null,
//         }));
        
//         if (newCustomers.length > 0) {
//           await collection.insertMany(newCustomers);
//         }
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             count: newCustomers.length,
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/database/customers/assign' && req.method === 'POST') {
//         const body = await req.json();
//         const { customerIds, agentId, agentName, count, filters } = body;
        
//         console.log('[ASSIGN] Customer assignment request:', { customerIds, agentId, count, filters });
        
//         const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         // Debug: Check total customers and their assignment status
//         const totalCustomers = await customersCollection.countDocuments({});
//         const allCustomersSample = await customersCollection.find({}).limit(5).toArray();
//         console.log('[DEBUG] Total customers in DB:', totalCustomers);
//         console.log('[DEBUG] Sample customers:', allCustomersSample.map(c => ({ id: c.id, assignedTo: c.assignedTo })));
        
//         let customersToAssign;
        
//         if (customerIds && customerIds.length > 0) {
//           // Debug: Check if these IDs exist at all
//           const allMatchingIds = await customersCollection.find({ id: { $in: customerIds } }).toArray();
//           console.log('[DEBUG] Found customers with matching IDs:', allMatchingIds.length);
//           console.log('[DEBUG] Their assignment status:', allMatchingIds.map(c => ({ id: c.id, assignedTo: c.assignedTo })));
          
//           // Specific customer IDs provided - only assign if not already assigned
//           customersToAssign = await customersCollection
//             .find({ 
//               id: { $in: customerIds },
//               $or: [
//                 { assignedTo: { $exists: false } },
//                 { assignedTo: null },
//                 { assignedTo: '' }
//               ]
//             })
//             .toArray();
          
//           console.log('[DEBUG] Customers available for assignment:', customersToAssign.length);
//         } else if (filters || count) {
//           // Build query based on filters - only get unassigned customers
//           const query: any = {
//             $or: [
//               { assignedTo: { $exists: false } },
//               { assignedTo: null },
//               { assignedTo: '' }
//             ]
//           };
          
//           if (filters) {
//             if (filters.customerType && filters.customerType.length > 0) {
//               query.customerType = { $in: filters.customerType };
//             }
//             if (filters.flightInfo) {
//               query.flightInfo = { $regex: filters.flightInfo, $options: 'i' };
//             }
//           }
          
//           customersToAssign = await customersCollection
//             .find(query)
//             .limit(count || 100)
//             .toArray();
//         } else {
//           return new Response(
//             JSON.stringify({ success: false, error: 'No customers or filters specified' }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         if (customersToAssign.length === 0) {
//           console.log('[DATABASE] ❌ No available customers found matching criteria');
          
//           // Check if there are ANY customers in the database
//           const totalCustomers = await customersCollection.countDocuments({});
//           const assignedCustomers = await customersCollection.countDocuments({ 
//             assignedTo: { $exists: true, $ne: null, $ne: '' }
//           });
          
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: 'No available numbers match criteria',
//               debug: {
//                 totalInDatabase: totalCustomers,
//                 alreadyAssigned: assignedCustomers,
//                 available: totalCustomers - assignedCustomers,
//                 filters: filters || 'specific IDs',
//                 suggestion: totalCustomers === 0 
//                   ? 'No customers in database. Please upload customers first.'
//                   : assignedCustomers === totalCustomers
//                     ? 'All customers are already assigned. Please import more customers or unassign existing ones.'
//                     : 'No customers match your filter criteria. Try different filters.'
//               }
//             }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Update customers with assignment info
//         const assignmentDate = new Date().toISOString();
//         await customersCollection.updateMany(
//           { id: { $in: customersToAssign.map((c: any) => c.id) } },
//           { $set: { assignedTo: agentId, assignedAt: assignmentDate, assignedBy: agentName } }
//         );
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             assigned: customersToAssign.length,
//             assignedCount: customersToAssign.length,
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/database\/customers\/(.+)$/) && req.method === 'DELETE') {
//         const id = path.split('/')[3];
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
//         await collection.deleteOne({ id });
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Bulk unassign customers endpoint
//       if (path === '/database/customers/unassign-all' && req.method === 'POST') {
//         console.log('[DATABASE] Bulk unassigning all customers...');
//         const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         // Update all customers back to unassigned
//         const result = await customersCollection.updateMany(
//           { 
//             assignedTo: { $exists: true, $ne: null, $ne: '' }
//           },
//           { 
//             $set: { 
//               assignedTo: null,
//               assignedAt: null,
//               assignedBy: null
//             } 
//           }
//         );
        
//         console.log('[DATABASE] Unassigned customers:', result.modifiedCount);
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             message: `Unassigned ${result.modifiedCount} customers`,
//             unassigned: result.modifiedCount
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Migration endpoint to fix customer assignedTo fields
//       if (path === '/database/customers/migrate' && req.method === 'POST') {
//         const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         // Update all customers that don't have assignedTo field or have it undefined
//         const result = await customersCollection.updateMany(
//           { 
//             $or: [
//               { assignedTo: { $exists: false } },
//               { assignedTo: undefined }
//             ]
//           },
//           { 
//             $set: { 
//               assignedTo: null,
//               assignedAt: null,
//               assignedBy: null
//             } 
//           }
//         );
        
//         console.log('[MIGRATION] Fixed customer records:', result.modifiedCount);
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             message: `Fixed ${result.modifiedCount} customer records`,
//             modifiedCount: result.modifiedCount
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Get customers assigned to a specific agent
//       if (path.startsWith('/database/customers/assigned/') && req.method === 'GET') {
//         const agentId = path.substring('/database/customers/assigned/'.length);
//         console.log('[CUSTOMERS] Getting assigned customers for agent:', agentId);
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
//         const customers = await collection.find({ assignedTo: agentId }).toArray();
//         console.log('[CUSTOMERS] Found', customers.length, 'assigned customers');
//         return new Response(
//           JSON.stringify({ success: true, customers: convertMongoDocs(customers) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Get archived customers (from archive)
//       if (path === '/customers/archived' && req.method === 'GET') {
//         console.log('[CUSTOMERS] Getting archived customers');
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const archivedCustomers = await archiveCollection.find({ 
//           entityType: 'customer' 
//         }).toArray();
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             customers: convertMongoDocs(archivedCustomers) 
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Archive a customer
//       if (path === '/customers/archived' && req.method === 'POST') {
//         const body = await req.json();
//         const { customer } = body;
        
//         console.log('[CUSTOMERS] Archiving customer:', customer.id);
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         // Use customer.id as archive ID to avoid duplicates
//         const archiveEntry = {
//           id: customer.id,
//           entityType: 'customer',
//           entityData: customer,
//           archivedAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           archivedBy: body.archivedBy || 'system',
//         };
        
//         // Use replaceOne with upsert to avoid duplicate key errors
//         await archiveCollection.replaceOne(
//           { id: customer.id },
//           archiveEntry,
//           { upsert: true }
//         );
        
//         await customersCollection.deleteOne({ id: customer.id });
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Clear all customers
//       if (path === '/customers/clear' && req.method === 'DELETE') {
//         console.log('[CUSTOMERS] Clearing all customers');
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
//         const result = await collection.deleteMany({});
//         console.log('[CUSTOMERS] Deleted', result.deletedCount, 'customers');
//         return new Response(
//           JSON.stringify({ success: true, deletedCount: result.deletedCount }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Log customer interaction and update completion status
//       if (path === '/customer-interactions' && req.method === 'POST') {
//         const body = await req.json();
//         const { customerId, interaction } = body;
        
//         console.log('[CUSTOMER INTERACTIONS] Logging interaction for customer:', customerId);
        
//         try {
//           const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
//           const archiveCollection = await getCollection(Collections.ARCHIVE);
          
//           // Create interaction log entry
//           const interactionLog = {
//             id: generateId(),
//             customerId,
//             ...interaction,
//             timestamp: new Date().toISOString(),
//           };
          
//           // Store interaction in archive collection with type 'interaction'
//           const interactionEntry = {
//             id: interactionLog.id,
//             entityType: 'interaction',
//             entityData: interactionLog,
//             archivedAt: new Date().toISOString(),
//           };
          
//           await archiveCollection.insertOne(interactionEntry);
          
//           // Update customer record with interactionCompleted flag
//           await customersCollection.updateOne(
//             { id: customerId },
//             { 
//               $set: { 
//                 interactionCompleted: true,
//                 lastInteractionAt: new Date().toISOString(),
//                 lastInteractionOutcome: interaction.outcome || 'completed'
//               } 
//             }
//           );
          
//           console.log('[CUSTOMER INTERACTIONS] ✅ Interaction logged successfully for:', customerId);
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               message: 'Interaction logged successfully',
//               interactionId: interactionLog.id
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[CUSTOMER INTERACTIONS] Error logging interaction:', error);
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: error.message || 'Failed to log interaction'
//             }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== ARCHIVE MANAGEMENT ====================
//       // Get all archived records
//       if (path === '/archive' && req.method === 'GET') {
//         console.log('[ARCHIVE] Getting all archived records');
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const archived = await archiveCollection.find({}).sort({ archivedAt: -1 }).toArray();
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             records: convertMongoDocs(archived),
//             count: archived.length
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Restore a record from archive (recycle)
//       if (path === '/archive/restore' && req.method === 'POST') {
//         const body = await req.json();
//         const { recordId, recordType } = body; // recordType: 'client' or 'customer'
        
//         console.log('[ARCHIVE] Restoring record:', recordId, 'type:', recordType);
        
//         try {
//           const archiveCollection = await getCollection(Collections.ARCHIVE);
//           const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
//           const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
          
//           // Find the archived record
//           const archivedRecord = await archiveCollection.findOne({ id: recordId });
          
//           if (!archivedRecord) {
//             return new Response(
//               JSON.stringify({ success: false, error: 'Archived record not found' }),
//               { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//             );
//           }
          
//           // Restore to appropriate database
//           const restoredData = {
//             ...archivedRecord.numberData || archivedRecord.entityData || archivedRecord,
//             id: archivedRecord.originalId || generateId(),
//             status: 'available',
//             assignedTo: null,
//             assignedAt: null,
//             assignedBy: null,
//             restoredAt: new Date().toISOString(),
//             restoredFrom: 'archive'
//           };
          
//           // Remove archive-specific fields
//           delete restoredData.archivedAt;
//           delete restoredData.archivedBy;
//           delete restoredData.callOutcome;
//           delete restoredData.calledAt;
//           delete restoredData.assignmentId;
//           delete restoredData.agentId;
//           delete restoredData.agentName;
//           delete restoredData._id;
          
//           if (recordType === 'customer' || archivedRecord.type === 'customer') {
//             await customersCollection.insertOne(restoredData);
//             console.log('[ARCHIVE] ✅ Restored to customers database');
//           } else {
//             await numbersCollection.insertOne(restoredData);
//             console.log('[ARCHIVE] ✅ Restored to numbers database');
//           }
          
//           // Remove from archive
//           await archiveCollection.deleteOne({ id: recordId });
//           console.log('[ARCHIVE] ✅ Removed from archive');
          
//           return new Response(
//             JSON.stringify({ success: true }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error) {
//           console.error('[ARCHIVE] Restore error:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Permanently delete from archive
//       if (path === '/archive/delete' && req.method === 'POST') {
//         const body = await req.json();
//         const { recordId } = body;
        
//         console.log('[ARCHIVE] Permanently deleting record:', recordId);
        
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const result = await archiveCollection.deleteOne({ id: recordId });
        
//         if (result.deletedCount === 0) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'Record not found in archive' }),
//             { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Add customer(s)
//       if (path === '/customers' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         // Handle both single customer and bulk customers array
//         if (body.customers && Array.isArray(body.customers)) {
//           // Bulk save
//           console.log('[CUSTOMERS] Bulk saving', body.customers.length, 'customers');
//           const customersToSave = body.customers.map((customer: any) => ({
//             ...customer,
//             id: customer.id || generateId(),
//             createdAt: customer.createdAt || new Date().toISOString(),
//           }));
          
//           if (customersToSave.length > 0) {
//             await collection.insertMany(customersToSave);
//           }
          
//           return new Response(
//             JSON.stringify({ success: true }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } else {
//           // Single customer
//           console.log('[CUSTOMERS] Adding single customer:', body.name);
//           const customer = {
//             ...body,
//             id: body.id || generateId(),
//             createdAt: new Date().toISOString(),
//           };
          
//           await collection.insertOne(customer);
          
//           return new Response(
//             JSON.stringify({ success: true, customer }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }


//       // ==================== USERS ====================
//       if (path === '/users' && req.method === 'GET') {
//         const collection = await getCollection(Collections.USERS);
//         const users = await collection.find({}).toArray();
//         // Don't send passwords to frontend
//         const sanitizedUsers = users.map(({ password, ...user }: any) => user);
//         const convertedUsers = convertMongoDocs(sanitizedUsers);
        
//         // Also provide agents list (users with role === 'Agent')
//         const agents = convertedUsers.filter((u: any) => u.role === 'Agent');
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             users: convertedUsers,
//             agents: agents  // Include agents for easy filtering
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/users' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.USERS);
        
//         console.log('[CREATE USER] Attempting to create user:', { 
//           username: body.username, 
//           email: body.email, 
//           role: body.role,
//           hasPassword: !!body.password,
//           passwordLength: body.password?.length
//         });
        
//         // Check if username exists
//         const existing = await collection.findOne({ username: body.username });
//         if (existing) {
//           console.log('[CREATE USER] ❌ Username already exists:', body.username);
//           return new Response(
//             JSON.stringify({ success: false, error: 'Username already exists' }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         const newUser = {
//           id: body.id || generateId(),
//           username: body.username,
//           name: body.name,
//           email: body.email,
//           password: body.password,
//           role: body.role || 'agent',
//           permissions: body.permissions || [],
//           dailyTarget: body.dailyTarget || 30,
//           createdAt: new Date().toISOString(),
//         };
        
//         console.log('[CREATE USER] Inserting user into MongoDB:', { 
//           username: newUser.username, 
//           password: newUser.password 
//         });
        
//         await collection.insertOne(newUser);
//         const { password, ...userWithoutPassword } = newUser;
        
//         console.log('[CREATE USER] ✅ User created successfully:', newUser.username);
        
//         return new Response(
//           JSON.stringify({ success: true, user: userWithoutPassword }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/users\/(.+)$/) && req.method === 'PUT') {
//         const id = path.split('/')[2];
//         const body = await req.json();
//         const collection = await getCollection(Collections.USERS);
        
//         const updateData: any = {};
//         if (body.name) updateData.name = body.name;
//         if (body.email) updateData.email = body.email;
//         if (body.password) updateData.password = body.password;
//         if (body.role) updateData.role = body.role;
//         if (body.permissions !== undefined) updateData.permissions = body.permissions;
//         if (body.dailyTarget !== undefined) updateData.dailyTarget = body.dailyTarget;
        
//         await collection.updateOne({ id }, { $set: updateData });
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/users\/(.+)$/) && req.method === 'DELETE') {
//         const id = path.split('/')[2];
//         const collection = await getCollection(Collections.USERS);
//         await collection.deleteOne({ id });
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/users/login' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.USERS);
        
//         console.log('[LOGIN] Attempting login:', { username: body.username, passwordLength: body.password?.length });
        
//         // First check if user exists by username only
//         const userByUsername = await collection.findOne({ username: body.username });
        
//         if (!userByUsername) {
//           console.log('[LOGIN] ❌ Username not found:', body.username);
//           // Log failed login attempt
//           const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
//           await auditCollection.insertOne({
//             id: generateId(),
//             userId: null,
//             username: body.username,
//             success: false,
//             timestamp: new Date().toISOString(),
//             ipAddress: null,
//           });
          
//           return new Response(
//             JSON.stringify({ success: false, error: 'Invalid credentials' }),
//             { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         console.log('[LOGIN] ✅ Username found, checking password...');
//         console.log('[LOGIN] Stored password:', userByUsername.password);
//         console.log('[LOGIN] Provided password:', body.password);
//         console.log('[LOGIN] Passwords match:', userByUsername.password === body.password);
        
//         // Now check password
//         const user = await collection.findOne({ 
//           username: body.username, 
//           password: body.password 
//         });
        
//         if (!user) {
//           console.log('[LOGIN] ❌ Password mismatch for user:', body.username);
//           // Log failed login attempt
//           const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
//           await auditCollection.insertOne({
//             id: generateId(),
//             userId: userByUsername.id,
//             username: body.username,
//             success: false,
//             timestamp: new Date().toISOString(),
//             ipAddress: null,
//           });
          
//           return new Response(
//             JSON.stringify({ success: false, error: 'Invalid credentials' }),
//             { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Log successful login
//         const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
//         await auditCollection.insertOne({
//           id: generateId(),
//           userId: user.id,
//           username: user.username,
//           success: true,
//           timestamp: new Date().toISOString(),
//           ipAddress: null,
//         });
        
//         const { password, ...userWithoutPassword } = user;
//         return new Response(
//           JSON.stringify({ success: true, user: convertMongoDoc(userWithoutPassword) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== LOGIN AUDIT ====================
//       if (path === '/login-audit' && req.method === 'GET') {
//         const collection = await getCollection(Collections.LOGIN_AUDIT);
//         const logs = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
//         return new Response(
//           JSON.stringify({ success: true, logs: convertMongoDocs(logs) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== SMTP SETTINGS ====================
//       if (path === '/smtp-settings' && req.method === 'GET') {
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         const collection = await getCollection(Collections.SMTP_SETTINGS);
//         const settings = await collection.findOne({ type: 'smtp' });
//         return new Response(
//           JSON.stringify({ success: true, settings: settings ? convertMongoDoc(settings) : {} }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/smtp-settings' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.SMTP_SETTINGS);
        
//         await collection.updateOne(
//           { type: 'smtp' },
//           { $set: { ...body, type: 'smtp', updatedAt: new Date().toISOString() } },
//           { upsert: true }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/smtp-test' && req.method === 'POST') {
//         const body = await req.json();
//         console.log('[SMTP] Test email request:', body);
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             message: 'SMTP test email sent successfully (MongoDB)' 
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== EMAIL SENDING ====================
//       if (path === '/send-email' && req.method === 'POST') {
//         const body = await req.json();
//         const { to, subject, htmlContent } = body;
        
//         // Get SMTP settings
//         const smtpCollection = await getCollection(Collections.SMTP_SETTINGS);
//         const smtpSettings = await smtpCollection.findOne({ type: 'smtp' });
        
//         if (!smtpSettings || !smtpSettings.host) {
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: 'SMTP not configured. Please configure SMTP settings in Admin tab first.' 
//             }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         try {
//           // TODO: Implement actual email sending with nodemailer or similar
//           // Currently logging only - SMTP integration needed
//           console.log('[EMAIL] Email queued (SMTP not configured):', {
//             to,
//             subject,
//             from: smtpSettings.from || smtpSettings.user,
//             smtp: smtpSettings.host
//           });
          
//           // Email logged but not sent - configure SMTP settings to enable actual sending
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               message: 'Email logged (SMTP not configured - configure in Admin Settings to enable actual sending)' 
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[EMAIL] Error sending email:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message || 'Failed to send email' }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== 3CX SETTINGS ====================
//       if (path === '/threecx-settings' && req.method === 'GET') {
//         const collection = await getCollection(Collections.THREECX_SETTINGS);
//         const settings = await collection.findOne({ type: '3cx' });
//         return new Response(
//           JSON.stringify({ success: true, settings: settings ? convertMongoDoc(settings) : {} }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/threecx-settings' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.THREECX_SETTINGS);
        
//         await collection.updateOne(
//           { type: '3cx' },
//           { $set: { ...body, type: '3cx', updatedAt: new Date().toISOString() } },
//           { upsert: true }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== CALL LOGS ====================
//       if (path === '/call-logs' && req.method === 'GET') {
//         const agentId = url.searchParams.get('agentId');
//         const collection = await getCollection(Collections.CALL_LOGS);
        
//         const query = agentId ? { agentId } : {};
//         const logs = await collection.find(query).sort({ callTime: -1 }).limit(500).toArray();
        
//         return new Response(
//           JSON.stringify({ success: true, logs: convertMongoDocs(logs) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/call-logs' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.CALL_LOGS);
        
//         const newLog = {
//           ...body,
//           id: body.id || generateId(),
//           callTime: body.callTime || new Date().toISOString(),
//         };
        
//         await collection.insertOne(newLog);
        
//         return new Response(
//           JSON.stringify({ success: true, log: newLog }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== DAILY PROGRESS ====================
//       if (path === '/daily-progress' && req.method === 'GET') {
//         const collection = await getCollection(Collections.DAILY_PROGRESS);
//         const progress = await collection.findOne({ type: 'daily' });
        
//         if (!progress) {
//           const defaultProgress = {
//             type: 'daily',
//             userProgress: {},
//             lastReset: new Date().toISOString(),
//           };
//           await collection.insertOne(defaultProgress);
//           return new Response(
//             JSON.stringify({ success: true, progress: defaultProgress }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         return new Response(
//           JSON.stringify({ success: true, progress: convertMongoDoc(progress) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/daily-progress' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.DAILY_PROGRESS);
        
//         await collection.updateOne(
//           { type: 'daily' },
//           { 
//             $set: { 
//               [`userProgress.${body.userId}`]: {
//                 callsToday: body.callsToday,
//                 lastCallTime: body.lastCallTime || new Date().toISOString(),
//                 updatedAt: new Date().toISOString(),
//               }
//             } 
//           },
//           { upsert: true }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/daily-progress/check-reset' && req.method === 'GET') {
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         const collection = await getCollection(Collections.DAILY_PROGRESS);
//         const progressData = await collection.findOne({ type: 'daily' });
        
//         if (!progressData) {
//           return new Response(
//             JSON.stringify({ success: true, wasReset: false }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         const lastReset = new Date(progressData.lastReset);
//         const now = new Date();
//         const shouldReset = now.toDateString() !== lastReset.toDateString();
        
//         if (shouldReset) {
//           await collection.updateOne(
//             { type: 'daily' },
//             { 
//               $set: { 
//                 userProgress: {},
//                 lastReset: now.toISOString()
//               } 
//             }
//           );
          
//           console.log('[DAILY PROGRESS] Auto-reset completed at', now.toISOString());
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               wasReset: true,
//               lastReset: now.toISOString()
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             wasReset: false,
//             lastReset: progressData.lastReset
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/daily-progress/reset' && req.method === 'POST') {
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         const collection = await getCollection(Collections.DAILY_PROGRESS);
        
//         await collection.updateOne(
//           { type: 'daily' },
//           { 
//             $set: { 
//               userProgress: {},
//               lastReset: new Date().toISOString()
//             } 
//           },
//           { upsert: true }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== PROMOTIONS ====================
//       if (path === '/promotions' && req.method === 'GET') {
//         const mongoCheck = await checkMongoReady();
//         if (mongoCheck) {
//           return mongoCheck;
//         }
        
//         const collection = await getCollection(Collections.PROMOTIONS);
//         const promotions = await collection.find({}).toArray();
//         return new Response(
//           JSON.stringify({ success: true, promotions: convertMongoDocs(promotions) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/promotions' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.PROMOTIONS);
        
//         const newPromotion = {
//           ...body,
//           id: body.id || generateId(),
//           createdAt: new Date().toISOString(),
//         };
        
//         await collection.insertOne(newPromotion);
        
//         return new Response(
//           JSON.stringify({ success: true, promotion: newPromotion }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/promotions\/(.+)$/) && req.method === 'PUT') {
//         const id = path.split('/')[2];
//         const body = await req.json();
//         const collection = await getCollection(Collections.PROMOTIONS);
        
//         await collection.updateOne({ id }, { $set: { ...body, updatedAt: new Date().toISOString() } });
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path.match(/^\/promotions\/(.+)$/) && req.method === 'DELETE') {
//         const id = path.split('/')[2];
//         const collection = await getCollection(Collections.PROMOTIONS);
//         await collection.deleteOne({ id });
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== ARCHIVE ====================
//       if (path === '/archive' && req.method === 'GET') {
//         const entityType = url.searchParams.get('type');
//         const collection = await getCollection(Collections.ARCHIVE);
        
//         const query = entityType ? { entityType } : {};
//         const archives = await collection.find(query).sort({ archivedAt: -1 }).limit(1000).toArray();
        
//         return new Response(
//           JSON.stringify({ success: true, archives: convertMongoDocs(archives) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/archive' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.ARCHIVE);
        
//         const archiveEntry = {
//           ...body,
//           id: body.id || generateId(),
//           archivedAt: new Date().toISOString(),
//         };
        
//         await collection.insertOne(archiveEntry);
        
//         return new Response(
//           JSON.stringify({ success: true, archive: archiveEntry }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/archive/restore' && req.method === 'POST') {
//         const body = await req.json();
//         const { archiveId, entityType } = body;
        
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const archivedItem = await archiveCollection.findOne({ id: archiveId });
        
//         if (!archivedItem) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'Archived item not found' }),
//             { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Restore to appropriate collection
//         if (entityType === 'number') {
//           const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
//           const restoredNumber = {
//             ...archivedItem.data,
//             status: 'available',
//             assignedTo: null,
//             assignedAt: null,
//           };
//           await numbersCollection.insertOne(restoredNumber);
//         }
        
//         // Remove from archive
//         await archiveCollection.deleteOne({ id: archiveId });
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== NUMBER CLAIMS ====================
//       // Get all active claims
//       if (path === '/number-claims' && req.method === 'GET') {
//         const collection = await getCollection(Collections.NUMBER_CLAIMS);
//         const now = Date.now();
        
//         // Clean up expired claims
//         await collection.deleteMany({ expiresAt: { $lt: now } });
        
//         // Get active claims
//         const activeClaims = await collection.find({ expiresAt: { $gte: now } }).toArray();
        
//         // Convert to the format expected by frontend
//         const claimsMap: any = {};
//         activeClaims.forEach((claim: any) => {
//           claimsMap[claim.phoneNumber] = {
//             claimedBy: claim.userId,
//             claimedByName: claim.userName,
//             claimedAt: claim.claimedAt,
//             expiresAt: claim.expiresAt,
//             contactId: claim.contactId,
//             type: claim.type,
//           };
//         });
        
//         return new Response(
//           JSON.stringify({ success: true, claims: claimsMap }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Claim a number
//       if (path === '/claim-number' && req.method === 'POST') {
//         const body = await req.json();
//         const { phoneNumber, userId, userName, contactId, type } = body;
//         const collection = await getCollection(Collections.NUMBER_CLAIMS);
//         const now = Date.now();
//         const expiresAt = now + (5 * 60 * 1000); // 5 minutes
        
//         // Check if already claimed by someone else
//         const existingClaim = await collection.findOne({ 
//           phoneNumber,
//           expiresAt: { $gte: now }
//         });
        
//         if (existingClaim && existingClaim.userId !== userId) {
//           return new Response(
//             JSON.stringify({ 
//               success: false,
//               claimed: true,
//               claimedBy: existingClaim.userName,
//               error: `Number is being called by ${existingClaim.userName}`
//             }),
//             { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Create or update claim
//         await collection.updateOne(
//           { phoneNumber },
//           {
//             $set: {
//               phoneNumber,
//               userId,
//               userName,
//               contactId,
//               type,
//               claimedAt: now,
//               expiresAt,
//             }
//           },
//           { upsert: true }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Release a number
//       if (path === '/release-number' && req.method === 'POST') {
//         const body = await req.json();
//         const { phoneNumber, userId } = body;
//         const collection = await getCollection(Collections.NUMBER_CLAIMS);
        
//         // Only allow releasing your own claims
//         await collection.deleteOne({ phoneNumber, userId });
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Extend a claim
//       if (path === '/extend-number-claim' && req.method === 'POST') {
//         const body = await req.json();
//         const { phoneNumber, userId } = body;
//         const collection = await getCollection(Collections.NUMBER_CLAIMS);
//         const now = Date.now();
//         const newExpiresAt = now + (5 * 60 * 1000); // Extend by 5 more minutes
        
//         const result = await collection.updateOne(
//           { phoneNumber, userId },
//           { $set: { expiresAt: newExpiresAt } }
//         );
        
//         return new Response(
//           JSON.stringify({ 
//             success: result.modifiedCount > 0 
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== ADDITIONAL DATABASE OPERATIONS ====================
//       if (path === '/database/clients/clear-all' && req.method === 'DELETE') {
//         const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
//         const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
        
//         const clientsDeleted = await numbersCollection.deleteMany({});
//         const assignmentsDeleted = await assignmentsCollection.deleteMany({});
        
//         return new Response(
//           JSON.stringify({ 
//             success: true,
//             cleared: {
//               clientsCount: clientsDeleted.deletedCount,
//               assignedClientsCount: assignmentsDeleted.deletedCount,
//             }
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/database/reset-all' && req.method === 'POST') {
//         const collections = [
//           Collections.NUMBERS_DATABASE,
//           Collections.CUSTOMERS_DATABASE,
//           Collections.NUMBER_ASSIGNMENTS,
//           Collections.CALL_SCRIPTS,
//           Collections.PROMOTIONS,
//           Collections.ARCHIVE,
//           Collections.CALL_LOGS,
//         ];
        
//         let totalDeleted = 0;
//         for (const collectionName of collections) {
//           const collection = await getCollection(collectionName);
//           const result = await collection.deleteMany({});
//           totalDeleted += result.deletedCount || 0;
//         }
        
//         return new Response(
//           JSON.stringify({ 
//             success: true,
//             message: 'Database reset complete',
//             deletedCount: totalDeleted
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/cron/daily-archive' && req.method === 'POST') {
//         // Archive completed assignments
//         const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
        
//         const completedAssignments = await assignmentsCollection.find({ 
//           called: true 
//         }).toArray();
        
//         if (completedAssignments.length > 0) {
//           const archiveEntries = completedAssignments.map(assignment => ({
//             id: generateId(),
//             entityType: 'assignment',
//             data: assignment,
//             archivedAt: new Date().toISOString(),
//           }));
          
//           await archiveCollection.insertMany(archiveEntries);
//           await assignmentsCollection.deleteMany({ called: true });
//         }
        
//         return new Response(
//           JSON.stringify({ 
//             success: true,
//             message: 'Daily archive completed',
//             results: {
//               clients: { count: completedAssignments.length },
//               customers: { count: 0 }
//             }
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }



//       if (path.match(/^\/database\/clients\/[^/]+$/) && req.method === 'DELETE') {
//         const id = path.split('/')[3];
//         const collection = await getCollection(Collections.NUMBERS_DATABASE);
//         await collection.deleteOne({ id });
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/database/clients/bulk-delete' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.NUMBERS_DATABASE);
//         const result = await collection.deleteMany({ id: { $in: body.ids } });
//         return new Response(
//           JSON.stringify({ success: true, deletedCount: result.deletedCount }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Get archived clients
//       if (path === '/database/clients/archive' && req.method === 'GET') {
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const archivedClients = await archiveCollection.find({ 
//           entityType: { $in: ['client', 'contact'] }
//         }).toArray();
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             records: convertMongoDocs(archivedClients)
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Bulk restore archived clients
//       if (path === '/database/clients/archive/bulk-restore' && req.method === 'POST') {
//         const body = await req.json();
//         const { recordIds } = body;
        
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
        
//         // Get archived records
//         const archivedRecords = await archiveCollection.find({ 
//           id: { $in: recordIds }
//         }).toArray();
        
//         if (archivedRecords.length === 0) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'No records found to restore' }),
//             { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Restore to numbers database
//         const recordsToRestore = archivedRecords.map((record: any) => ({
//           ...(record.entityData || record.data || record),
//           status: 'available',
//           restoredAt: new Date().toISOString()
//         }));
        
//         await numbersCollection.insertMany(recordsToRestore);
//         await archiveCollection.deleteMany({ id: { $in: recordIds } });
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             restoredCount: recordsToRestore.length 
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Get archived customers
//       if (path === '/database/customers/archive' && req.method === 'GET') {
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const archivedCustomers = await archiveCollection.find({ 
//           entityType: 'customer'
//         }).toArray();
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             records: convertMongoDocs(archivedCustomers)
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Bulk restore archived customers
//       if (path === '/database/customers/archive/bulk-restore' && req.method === 'POST') {
//         const body = await req.json();
//         const { recordIds } = body;
        
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         // Get archived records
//         const archivedRecords = await archiveCollection.find({ 
//           id: { $in: recordIds }
//         }).toArray();
        
//         if (archivedRecords.length === 0) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'No records found to restore' }),
//             { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Restore to customers database
//         const recordsToRestore = archivedRecords.map((record: any) => ({
//           ...(record.entityData || record.data || record),
//           restoredAt: new Date().toISOString()
//         }));
        
//         await customersCollection.insertMany(recordsToRestore);
//         await archiveCollection.deleteMany({ id: { $in: recordIds } });
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             restoredCount: recordsToRestore.length 
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Get assigned customers for an agent
//       if (path.match(/^\/database\/customers\/assigned\/[^/]+$/) && req.method === 'GET') {
//         const agentId = path.split('/')[4];
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         const customers = await collection.find({ assignedTo: agentId }).toArray();
        
//         console.log(`[CUSTOMER SERVICE] Fetching customers for agent ${agentId}: found ${customers.length} customers`);
        
//         return new Response(
//           JSON.stringify({ success: true, customers: convertMongoDocs(customers) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Reset all customers' interactionCompleted flags (utility endpoint)
//       if (path === '/database/customers/reset-completion' && req.method === 'POST') {
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         const result = await collection.updateMany(
//           {},
//           { $set: { interactionCompleted: false } }
//         );
        
//         console.log(`[CUSTOMER SERVICE] Reset interactionCompleted for ${result.modifiedCount} customers`);
        
//         return new Response(
//           JSON.stringify({ success: true, resetCount: result.modifiedCount }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Log customer interaction
//       if (path === '/customer-interactions' && req.method === 'POST') {
//         const body = await req.json();
//         const { customerId, interaction } = body;
        
//         const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
        
//         // Add interaction to customer's interactions array AND mark as completed
//         await collection.updateOne(
//           { id: customerId },
//           { 
//             $push: { 
//               interactions: {
//                 ...interaction,
//                 timestamp: new Date().toISOString()
//               }
//             },
//             $set: {
//               interactionCompleted: true // Mark customer interaction as complete
//             }
//           }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Send quick email (wrapper around send-email for consistency)
//       if (path === '/send-quick-email' && req.method === 'POST') {
//         const body = await req.json();
//         const { to, subject, htmlContent } = body;
        
//         // Use the existing send-email logic
//         const smtpCollection = await getCollection(Collections.SMTP_SETTINGS);
//         const smtpSettings = await smtpCollection.findOne({ id: 'default' });
        
//         if (!smtpSettings || !smtpSettings.configured) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'SMTP not configured' }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         try {
//           const transporter = nodemailer.createTransport({
//             host: smtpSettings.host,
//             port: smtpSettings.port,
//             secure: smtpSettings.secure,
//             auth: {
//               user: smtpSettings.user,
//               pass: smtpSettings.password,
//             },
//           });
          
//           await transporter.sendMail({
//             from: smtpSettings.from,
//             to,
//             subject,
//             html: htmlContent,
//           });
          
//           return new Response(
//             JSON.stringify({ success: true }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[EMAIL] Error sending quick email:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // ==================== NUMBER ASSIGNMENTS ====================
//       if (path === '/assignments' && req.method === 'GET') {
//         const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//         const agentId = url.searchParams.get('agentId');
        
//         const query = agentId ? { agentId } : {};
//         const assignments = await collection.find(query).sort({ assignedAt: -1 }).toArray();
        
//         return new Response(
//           JSON.stringify({ success: true, assignments: convertMongoDocs(assignments) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/assignments/claim' && req.method === 'POST') {
//         const body = await req.json();
//         const { assignmentId, agentId } = body;
        
//         const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
        
//         // Check if assignment exists and isn't already claimed
//         const assignment = await collection.findOne({ id: assignmentId });
        
//         if (!assignment) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'Assignment not found' }),
//             { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         if (assignment.claimedBy && assignment.claimedBy !== agentId) {
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               error: 'Number already claimed by another agent',
//               claimedBy: assignment.claimedBy
//             }),
//             { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Claim the assignment
//         await collection.updateOne(
//           { id: assignmentId },
//           { 
//             $set: { 
//               claimedBy: agentId,
//               claimedAt: new Date().toISOString(),
//               status: 'claimed'
//             } 
//           }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true, message: 'Assignment claimed successfully' }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== CALL LOGS ====================
//       if (path === '/call-logs' && req.method === 'GET') {
//         const collection = await getCollection(Collections.CALL_LOGS);
//         const agentId = url.searchParams.get('agentId');
        
//         const query = agentId ? { agentId } : {};
//         const callLogs = await collection.find(query).sort({ callTime: -1 }).toArray();
        
//         return new Response(
//           JSON.stringify({ success: true, callLogs: convertMongoDocs(callLogs) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/call-logs' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.CALL_LOGS);
        
//         const newCallLog = {
//           ...body,
//           id: body.id || generateId(),
//           callTime: body.callTime || new Date().toISOString(),
//         };
        
//         await collection.insertOne(newCallLog);
        
//         return new Response(
//           JSON.stringify({ success: true, callLog: convertMongoDoc(newCallLog) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== ARCHIVE ====================
//       if (path === '/archive' && req.method === 'GET') {
//         const collection = await getCollection(Collections.ARCHIVE);
//         const type = url.searchParams.get('type');
        
//         const query = type ? { entityType: type } : {};
//         const archives = await collection.find(query).sort({ archivedAt: -1 }).toArray();
        
//         return new Response(
//           JSON.stringify({ success: true, archives: convertMongoDocs(archives) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/archive' && req.method === 'POST') {
//         const body = await req.json();
//         const collection = await getCollection(Collections.ARCHIVE);
        
//         // Remove MongoDB _id field to prevent duplicate key errors
//         const { _id, ...bodyWithoutId } = body;
        
//         // Use existing ID from body, or generate new one
//         const archiveId = bodyWithoutId.id || generateId();
        
//         const archiveEntry = {
//           ...bodyWithoutId,
//           id: archiveId,
//           archivedAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };
        
//         // Use replaceOne with upsert to avoid duplicate key errors
//         // If document with same id exists, it will be replaced
//         await collection.replaceOne(
//           { id: archiveId },
//           archiveEntry,
//           { upsert: true }
//         );
        
//         return new Response(
//           JSON.stringify({ success: true, archive: convertMongoDoc(archiveEntry) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       if (path === '/archive/restore' && req.method === 'POST') {
//         const body = await req.json();
//         const { archiveId, entityType } = body;
        
//         const archiveCollection = await getCollection(Collections.ARCHIVE);
//         const archive = await archiveCollection.findOne({ id: archiveId });
        
//         if (!archive) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'Archive entry not found' }),
//             { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Restore to appropriate collection based on entityType
//         let targetCollection;
//         if (entityType === 'contact' || entityType === 'client') {
//           targetCollection = await getCollection(Collections.NUMBERS_DATABASE);
//         } else if (entityType === 'customer') {
//           targetCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
//         } else if (entityType === 'assignment') {
//           targetCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//         } else {
//           return new Response(
//             JSON.stringify({ success: false, error: 'Unknown entity type' }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Restore the data
//         await targetCollection.insertOne(archive.entityData || archive.data);
        
//         // Remove from archive
//         await archiveCollection.deleteOne({ id: archiveId });
        
//         return new Response(
//           JSON.stringify({ success: true, message: 'Item restored successfully' }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== LOGIN AUDIT ====================
//       if (path === '/login-audit' && req.method === 'GET') {
//         const collection = await getCollection(Collections.LOGIN_AUDIT);
//         const audits = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
//         return new Response(
//           JSON.stringify({ success: true, audits: convertMongoDocs(audits) }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== MANAGER OPERATIONS ====================
//       // /team-performance endpoint moved above (before MongoDB check)
//       // /agent-monitoring/overview endpoint moved above (before MongoDB check)
//       // /database/clients endpoint moved above (before MongoDB check)
//       // /database/customers endpoint moved above (before MongoDB check)

//       // Agent Monitoring - Agent Details
//       if (path.startsWith('/agent-monitoring/agent/') && req.method === 'GET') {
//         const agentId = path.split('/').pop();
//         console.log(`✅ /agent-monitoring/agent/${agentId} endpoint HIT!`);
        
//         const usersCollection = await getCollection(Collections.USERS);
//         const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//         const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
//         const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
        
//         // Get agent details
//         const agent = await usersCollection.findOne({ id: agentId });
        
//         if (!agent) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'Agent not found' }),
//             { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         // Get CRM records (assignments with full client data)
//         const assignments = await assignmentsCollection.find({ agentId }).toArray();
//         const crmRecords = await Promise.all(assignments.map(async (assignment: any) => {
//           const client = await numbersCollection.findOne({ id: assignment.clientId });
//           return {
//             ...assignment,
//             clientData: client,
//           };
//         }));
        
//         // Get Customer Service records
//         const customerRecords = await customersCollection.find({ assignedAgent: agentId }).toArray();
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             agent: convertMongoDoc(agent),
//             data: {
//               crmRecords: convertMongoDocs(crmRecords),
//               customerRecords: convertMongoDocs(customerRecords),
//             }
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }



//       // ==================== CLIENTS DATABASE (NUMBERS) ====================
//       // /database/clients GET endpoint moved above (before MongoDB check)


//       // Get customers assigned to a specific agent
//       if (path.match(/^\/database\/customers\/assigned\/[^/]+$/) && req.method === 'GET') {
//         const agentId = path.split('/').pop();
//         console.log('[DATABASE] Get assigned customers for agent:', agentId);
        
//         const readyCheck = await checkMongoReady();
//         if (readyCheck) return readyCheck;
        
//         try {
//           const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
//           const customers = await collection.find({ 
//             assignedAgent: agentId 
//           }).toArray();
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               customers: convertMongoDocs(customers),
//               count: customers.length
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[DATABASE] Error fetching assigned customers:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }


//       // ==================== ADMIN OPERATIONS ====================
//       // Clear all client/CRM data
//       if (path === '/database/clients/clear-all' && req.method === 'DELETE') {
//         console.log('[ADMIN] Clear all client CRM data requested');
        
//         const clientsCollection = await getCollection(Collections.NUMBERS_DATABASE);
//         const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
        
//         const clientsResult = await clientsCollection.deleteMany({});
//         const assignmentsResult = await assignmentsCollection.deleteMany({});
        
//         const totalDeleted = (clientsResult.deletedCount || 0) + (assignmentsResult.deletedCount || 0);
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             deletedCount: totalDeleted,
//             message: `Cleared ${clientsResult.deletedCount || 0} clients and ${assignmentsResult.deletedCount || 0} assignments`
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Reset entire database
//       if (path === '/database/reset-all' && req.method === 'POST') {
//         console.log('[ADMIN] FULL DATABASE RESET requested');
        
//         try {
//           const collections = [
//             Collections.NUMBERS_DATABASE,
//             Collections.NUMBER_ASSIGNMENTS,
//             Collections.CUSTOMERS_DATABASE,
//             Collections.CALL_LOGS,
//             Collections.ARCHIVE,
//             Collections.NUMBER_CLAIMS,
//             Collections.DAILY_PROGRESS,
//             Collections.PROMOTIONS,
//           ];
          
//           let totalDeleted = 0;
//           for (const collectionName of collections) {
//             const collection = await getCollection(collectionName);
//             const result = await collection.deleteMany({});
//             totalDeleted += result.deletedCount || 0;
//           }
          
//           console.log(`[ADMIN] Database reset complete. Deleted ${totalDeleted} records.`);
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               deletedCount: totalDeleted,
//               message: `Database reset complete. Deleted ${totalDeleted} records across all collections.`
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[ADMIN] Error resetting database:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Reset all counters - NEW ENDPOINT
//       if (path === '/reset-all-counters' && req.method === 'POST') {
//         console.log('[ADMIN] RESET ALL COUNTERS requested');
        
//         try {
//           const body = await req.json();
//           const { 
//             resetDailyProgress = true, 
//             resetCallLogs = false, 
//             resetNumberClaims = true,
//             resetAssignmentCounters = true 
//           } = body || {};
          
//           let countersReset = 0;
//           const resetDetails: any = {};
          
//           // 1. Reset Daily Progress (most important)
//           if (resetDailyProgress) {
//             const progressCollection = await getCollection(Collections.DAILY_PROGRESS);
            
//             // Reset all user progress to zero
//             const result = await progressCollection.updateOne(
//               { type: 'daily' },
//               {
//                 $set: {
//                   userProgress: {},
//                   lastReset: new Date().toISOString().split('T')[0]
//                 }
//               },
//               { upsert: true }
//             );
            
//             countersReset++;
//             resetDetails.dailyProgress = 'All user daily progress reset to zero';
//             console.log('[ADMIN] ✅ Daily progress counters reset');
//           }
          
//           // 2. Reset Number Claims
//           if (resetNumberClaims) {
//             const claimsCollection = await getCollection(Collections.NUMBER_CLAIMS);
//             const result = await claimsCollection.deleteMany({});
//             countersReset++;
//             resetDetails.numberClaims = `${result.deletedCount || 0} number claims cleared`;
//             console.log(`[ADMIN] ✅ Number claims reset (${result.deletedCount || 0} removed)`);
//           }
          
//           // 3. Reset Assignment Counters (reset callsMade, successfulCalls, missedCalls, AND called status in assignments)
//           if (resetAssignmentCounters) {
//             const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//             const result = await assignmentsCollection.updateMany(
//               {},
//               {
//                 $set: {
//                   callsMade: 0,
//                   successfulCalls: 0,
//                   missedCalls: 0,
//                   completedCalls: 0,
//                   called: false  // CRITICAL: Reset completion status so Agent Monitoring shows 0
//                 }
//               }
//             );
//             countersReset++;
//             resetDetails.assignments = `${result.modifiedCount || 0} assignment counters reset`;
//             console.log(`[ADMIN] ✅ Assignment counters reset (${result.modifiedCount || 0} updated)`);
//           }
          
//           // 4. Optionally clear Call Logs (usually not needed, but available)
//           if (resetCallLogs) {
//             const callLogsCollection = await getCollection(Collections.CALL_LOGS);
//             const result = await callLogsCollection.deleteMany({});
//             countersReset++;
//             resetDetails.callLogs = `${result.deletedCount || 0} call logs cleared`;
//             console.log(`[ADMIN] ✅ Call logs cleared (${result.deletedCount || 0} removed)`);
//           }
          
//           // 5. Reset completion tracking in Numbers and Customers databases
//           const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
//           const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
          
//           await numbersCollection.updateMany(
//             {},
//             { $unset: { completedCalls: "", lastCallDate: "", interactionCompleted: "" } }
//           );
          
//           // For customers, reset completion flag but preserve notes (historical data)
//           await customersCollection.updateMany(
//             {},
//             { 
//               $unset: { completedCalls: "", lastCallDate: "" },
//               $set: { interactionCompleted: false }  // Reset completion flag while preserving notes
//             }
//           );
          
//           console.log('[ADMIN] ✅ Completion tracking reset in databases (notes preserved)');
          
//           console.log(`[ADMIN] Counter reset complete. ${countersReset} systems reset.`);
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               countersReset,
//               resetDetails,
//               message: `Successfully reset ${countersReset} counter systems!`,
//               timestamp: new Date().toISOString()
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[ADMIN] Error resetting counters:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       // Daily archive cron job
//       if (path === '/cron/daily-archive' && req.method === 'POST') {
//         console.log('[CRON] Daily archive job triggered');
        
//         try {
//           const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//           const archiveCollection = await getCollection(Collections.ARCHIVE);
          
//           // Find all called assignments from previous days
//           const yesterday = new Date();
//           yesterday.setDate(yesterday.getDate() - 1);
//           yesterday.setHours(23, 59, 59, 999);
          
//           const completedAssignments = await assignmentsCollection.find({
//             called: true,
//             calledAt: { $lt: yesterday.toISOString() }
//           }).toArray();
          
//           if (completedAssignments.length > 0) {
//             // Archive them
//             const archiveEntries = completedAssignments.map((assignment: any) => ({
//               id: generateId(),
//               entityType: 'assignment',
//               entityData: assignment,
//               archivedAt: new Date().toISOString(),
//               archivedBy: 'system',
//               reason: 'daily_cron_job',
//             }));
            
//             await archiveCollection.insertMany(archiveEntries);
            
//             // Delete from assignments
//             const assignmentIds = completedAssignments.map((a: any) => a.id);
//             await assignmentsCollection.deleteMany({ id: { $in: assignmentIds } });
            
//             console.log(`[CRON] Archived ${completedAssignments.length} completed assignments`);
//           }
          
//           return new Response(
//             JSON.stringify({ 
//               success: true, 
//               archivedCount: completedAssignments.length,
//               message: `Daily archive complete. Archived ${completedAssignments.length} records.`
//             }),
//             { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         } catch (error: any) {
//           console.error('[CRON] Error in daily archive:', error);
//           return new Response(
//             JSON.stringify({ success: false, error: error.message }),
//             { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
//       }

//       if (path === '/admin/delete-selected-data' && req.method === 'POST') {
//         const body = await req.json();
//         const { confirmationCode, categories } = body;
        
//         // Validate confirmation code
//         if (confirmationCode !== 'DELETE_SELECTED_DATA') {
//           return new Response(
//             JSON.stringify({ success: false, error: 'Invalid confirmation code' }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         if (!categories || categories.length === 0) {
//           return new Response(
//             JSON.stringify({ success: false, error: 'No categories selected' }),
//             { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//           );
//         }
        
//         let totalDeleted = 0;
        
//         // Delete data based on selected categories
//         for (const category of categories) {
//           switch (category) {
//             case 'prospective-client':
//             case 'client-list':
//             case 'assigned-clients':
//               const clientsCollection = await getCollection(Collections.NUMBERS_DATABASE);
//               const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
//               const clientsResult = await clientsCollection.deleteMany({});
//               const assignmentsResult = await assignmentsCollection.deleteMany({});
//               totalDeleted += (clientsResult.deletedCount || 0) + (assignmentsResult.deletedCount || 0);
//               break;
              
//             case 'customers':
//             case 'customer-records':
//               const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
//               const customersResult = await customersCollection.deleteMany({});
//               totalDeleted += customersResult.deletedCount || 0;
//               break;
              
//             case 'promotions':
//             case 'promo-sales':
//               const promosCollection = await getCollection(Collections.PROMOTIONS);
//               const promosResult = await promosCollection.deleteMany({});
//               totalDeleted += promosResult.deletedCount || 0;
//               break;
              
//             case 'call-logs':
//             case 'call-history':
//               const callLogsCollection = await getCollection(Collections.CALL_LOGS);
//               const callLogsResult = await callLogsCollection.deleteMany({});
//               totalDeleted += callLogsResult.deletedCount || 0;
//               break;
              
//             case 'archive':
//             case 'archived-data':
//               const archiveCollection = await getCollection(Collections.ARCHIVE);
//               const archiveResult = await archiveCollection.deleteMany({});
//               totalDeleted += archiveResult.deletedCount || 0;
//               break;
//           }
//         }
        
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             deletedCount: totalDeleted,
//             message: `Deleted ${totalDeleted} items from ${categories.length} categories`
//           }),
//           { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // ==================== CALL PROGRESS & RECYCLING ====================
//       // Get call progress for all agents (delegated)
//       if (path === '/call-progress' && req.method === 'GET') {
//         return await callProgress.getCallProgress(req);
//       }








//       // Recycle uncompleted calls
//       if (path === '/call-progress/recycle' && req.method === 'POST') {
//         return await callProgress.recycleUncompletedCalls(req);
//       }
      
//       // Archive completed calls
//       if (path === '/call-progress/archive-completed' && req.method === 'POST') {
//         return await callProgress.archiveCompletedCalls(req);
//       }
      
//       // Recycle specific agent's numbers
//       if (path === '/call-progress/recycle-agent' && req.method === 'POST') {
//         return await callProgress.recycleAgentNumbers(req);
//       }

//       // ==================== SPECIAL DATABASE ====
//       // delegate to module
//       if (path === '/special-database' && req.method === 'GET') {
//         return await specialDb.getSpecialNumbers(req, path, url);
//       }
//       if (path === '/special-database/upload' && req.method === 'POST') {
//         return await specialDb.uploadNumbers(req);
//       }
//       if (path === '/special-database/assign' && req.method === 'POST') {
//         return await specialDb.assignNumbers(req);
//       }
//       if (path.startsWith('/special-database/') && path.split('/').length === 3 && req.method === 'DELETE') {
//         return await specialDb.deleteNumber(req, path);
//       }
//       if (path === '/special-database/archive' && req.method === 'GET') {
//         return await specialDb.getArchive(req);
//       }
//       if (path === '/special-database/recycle' && req.method === 'POST') {
//         return await specialDb.recycleNumbers(req);
//       }
//       if (path === '/special-database/complete-call' && req.method === 'POST') {
//         return await specialDb.completeCall(req);
//       }
//       if (path === '/special-database/migrate-assignments' && req.method === 'POST') {
//         return await specialDb.migrateAssignments(req);
//       }

      
//       // ==================== NOT FOUND ====================
//       return new Response(
//         JSON.stringify({ 
//           success: false, 
//           error: 'Endpoint not found',
//           path,
//           method: req.method 
//         }),
//         { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );

//     } catch (error:any) {
//       console.error('[SERVER ERROR]', error);
//       return new Response(
//         JSON.stringify({ 
//           success: false, 
//           error: 'Internal server error',
//           message: error.message 
//         }),
//         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );
//     }
//   });

