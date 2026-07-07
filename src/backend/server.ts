// BTM Travel CRM Backend Server - MongoDB Version
// Pure Deno server - No Supabase dependencies
import { getCollection, Collections, convertMongoDoc, convertMongoDocs, getMongoDb } from './mongodb.tsx';

// controllers
import * as healthController from './controllers/healthController.ts';
import * as setupController from './controllers/setupController.ts';
import * as managerController from './controllers/managerController.ts';
import * as callProgressRoutes from './routes/callProgress.ts';
import * as specialDbRoutes from './routes/specialDatabase.ts';
import * as emailRecipientsController from './controllers/emailRecipientsController.ts';
import * as usersController from './controllers/usersController.ts';
import * as authController from './controllers/authController.ts';
import * as auditController from './controllers/auditController.ts';


// shared constants/utilities
import { corsHeaders, SERVER_VERSION, SERVER_STARTED, generateId, determineAgentStatus } from './lib/common.ts';
import { ensureMongoInitialized, checkMongoReady, isMongoInitialized, isMongoInitializing } from './lib/db.ts';

// Mongo initialization is performed by the db module on import

// -----------------------------------------------------------------------------
// lightweight router that delegates requests to controller modules
// -----------------------------------------------------------------------------
export async function handleRequest(req: any): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // health & test
  if (path === '/health') return healthController.health(req);
  if (path === '/test') return healthController.test(req);
  if (path === '/test-setup') return healthController.testSetup(req);

  // debug endpoints
  if (path === '/debug/users') return healthController.debugUsers(req);
  if (path === '/debug/cors') return healthController.debugCors(req);
  if (path === '/debug/endpoints') return healthController.debugEndpoints(req);
  if (path === '/debug/manager-endpoints' && typeof healthController.debugManagerEndpoints === 'function') {
    return healthController.debugManagerEndpoints(req);
  }

  // setup
  if (path === '/setup/init' && method === 'POST') return setupController.initialize(req);

  // manager operations
  if (path === '/team-performance' && method === 'GET') return managerController.teamPerformance(req);
  if (path === '/agent-monitoring/overview' && method === 'GET') {
    return managerController.overview(req);
  }

  if (path.startsWith('/agent-monitoring/agent/') && method === 'GET') {
    const agentId = path.split('/').pop();
    return managerController.agentDetail(req, agentId);
  }

  // email recipients
  if (path === '/email-recipients' && method === 'GET') return emailRecipientsController.getRecipients(req);
  if (path === '/email-recipients' && method === 'POST') return emailRecipientsController.saveRecipients(req);

  // user management
  if (path === '/users' && method === 'GET') return usersController.listUsers(req);
  if (path === '/users' && method === 'POST') return usersController.createUser(req);
  if (path.startsWith('/users/') && method === 'PUT') {
    const userId = path.split('/users/')[1];
    return usersController.updateUser(req, userId);
  }
  if (path.startsWith('/users/') && method === 'DELETE') {
    const userId = path.split('/users/')[1];
    return usersController.deleteUser(req, userId);
  }

  // authentication / audit
  if (path === '/users/login' && method === 'POST') return authController.login(req);
  if (path === '/login-audit' && method === 'GET') return auditController.getLoginAudit(req);
  if (path === '/login-audit' && method === 'POST') return auditController.recordLoginAttempt(req);

  // database: clients
  if (path === '/database/clients' && method === 'GET') {
    const collection = await getCollection(Collections.NUMBERS_DATABASE);
    const clients = await collection.find({}).sort({ uploadedAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, clients: convertMongoDocs(clients), count: clients.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/clients/import' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.NUMBERS_DATABASE);
    const clients = (body.clients || body.records || []).map((client: any) => ({
      ...client,
      id: client.id || generateId(),
      importedAt: new Date().toISOString(),
      status: client.status || 'available',
      assignedTo: client.assignedTo || null,
      assignedAt: client.assignedAt || null,
      customerType: client.customerType || 'Retails',
      airplane: client.airplane || '',
    }));
    if (clients.length > 0) await collection.insertMany(clients);
    return new Response(JSON.stringify({ success: true, imported: clients.length, clients }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/clients/assign' && method === 'POST') {
    const body = await req.json();
    const clientIds = body.clientIds || body.ids || [];
    const agentId = body.agentId;
    const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);

    if (!agentId || (clientIds.length === 0 && !body.filters)) {
      return new Response(JSON.stringify({ success: false, error: 'Agent ID and client IDs or filters are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const query: any = {
      $or: [
        { status: 'available' },
        { status: { $exists: false } },
        { status: null },
        { status: '' }
      ],
      $and: [{ $or: [{ assignedTo: { $exists: false } }, { assignedTo: null }, { assignedTo: '' }] }]
    };

    if (clientIds.length > 0) query.id = { $in: clientIds };
    if (body.filters?.customerType) query.customerType = body.filters.customerType;
    if (body.filters?.airplane) query.airplane = body.filters.airplane;

    const numbersToAssign = await numbersCollection.find(query).toArray();
    if (numbersToAssign.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No available numbers match the request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const assignedAt = new Date().toISOString();
    const assignments = numbersToAssign.map((number: any) => ({
      id: generateId(),
      numberId: number.id,
      numberData: number,
      agentId,
      type: 'client',
      assignedAt,
      status: 'active',
      called: false,
      calledAt: null,
      outcome: null,
    }));

    await numbersCollection.updateMany({ id: { $in: numbersToAssign.map((n: any) => n.id) } }, { $set: { status: 'assigned', assignedTo: agentId, assignedAt } });
    await assignmentsCollection.insertMany(assignments);

    return new Response(JSON.stringify({ success: true, assigned: assignments.length, assignments: convertMongoDocs(assignments) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/clients/bulk-delete' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.NUMBERS_DATABASE);
    const result = await collection.deleteMany({ id: { $in: body.ids || [] } });
    return new Response(JSON.stringify({ success: true, deleted: result.deletedCount }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/clients/clear-all' && method === 'DELETE') {
    const numbersCollection = await getCollection(Collections.NUMBERS_DATABASE);
    const assignmentsCollection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const clientsDeleted = await numbersCollection.deleteMany({});
    const assignmentsDeleted = await assignmentsCollection.deleteMany({});
    return new Response(JSON.stringify({ success: true, cleared: { clientsCount: clientsDeleted.deletedCount, assignedClientsCount: assignmentsDeleted.deletedCount } }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/clients/archive' && method === 'GET') {
    const collection = await getCollection(Collections.ARCHIVE);
    const archived = await collection.find({ entityType: { $in: ['client', 'contact'] } }).toArray();
    return new Response(JSON.stringify({ success: true, records: convertMongoDocs(archived) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/clients/archive/bulk-restore' && method === 'POST') {
    const body = await req.json();
    const archiveCollection = await getCollection(Collections.ARCHIVE);
    const clientsCollection = await getCollection(Collections.NUMBERS_DATABASE);
    const records = await archiveCollection.find({ id: { $in: body.recordIds || [] } }).toArray();
    if (records.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No records found to restore' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const restored = records.map((record: any) => ({ ...(record.entityData || record.data || record), status: 'available', restoredAt: new Date().toISOString() }));
    await clientsCollection.insertMany(restored);
    await archiveCollection.deleteMany({ id: { $in: body.recordIds || [] } });
    return new Response(JSON.stringify({ success: true, restoredCount: restored.length }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/database/clients/') && method === 'DELETE') {
    const id = path.split('/').pop();
    const collection = await getCollection(Collections.NUMBERS_DATABASE);
    await collection.deleteOne({ id });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // database: customers
  if (path === '/database/customers' && method === 'GET') {
    const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
    const customers = await collection.find({}).sort({ uploadedAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, customers: convertMongoDocs(customers), count: customers.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/customers/import' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
    const customers = (body.customers || body.records || []).map((customer: any) => ({
      ...customer,
      id: customer.id || generateId(),
      importedAt: new Date().toISOString(),
      customerType: customer.customerType || 'Retails',
      flightInfo: customer.flightInfo || '',
      assignedTo: customer.assignedTo || null,
      assignedAt: customer.assignedAt || null,
      assignedBy: customer.assignedBy || null,
    }));
    if (customers.length > 0) await collection.insertMany(customers);
    return new Response(JSON.stringify({ success: true, count: customers.length, customers }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/customers/assign' && method === 'POST') {
    const body = await req.json();
    const customerIds = body.customerIds || body.ids || [];
    const agentId = body.agentId;
    const agentName = body.agentName || '';
    const collection = await getCollection(Collections.CUSTOMERS_DATABASE);

    if (!agentId || (customerIds.length === 0 && !body.filters && !body.count)) {
      return new Response(JSON.stringify({ success: false, error: 'Agent ID and customer IDs or filters are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const query: any = { $or: [{ assignedTo: { $exists: false } }, { assignedTo: null }, { assignedTo: '' }] };
    if (customerIds.length > 0) query.id = { $in: customerIds };
    if (body.filters?.customerType) query.customerType = { $in: body.filters.customerType };
    if (body.filters?.flightInfo) query.flightInfo = { $regex: body.filters.flightInfo, $options: 'i' };

    const customersToAssign = await collection.find(query).limit(body.count || 100).toArray();
    if (customersToAssign.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No available customers match the request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const assignedAt = new Date().toISOString();
    await collection.updateMany({ id: { $in: customersToAssign.map((c: any) => c.id) } }, { $set: { assignedTo: agentId, assignedAt, assignedBy: agentName } });
    return new Response(JSON.stringify({ success: true, assigned: customersToAssign.length, assignedCount: customersToAssign.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/customers/archive' && method === 'GET') {
    const collection = await getCollection(Collections.ARCHIVE);
    const archived = await collection.find({ entityType: 'customer' }).toArray();
    return new Response(JSON.stringify({ success: true, records: convertMongoDocs(archived) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/database/customers/archive/bulk-restore' && method === 'POST') {
    const body = await req.json();
    const archiveCollection = await getCollection(Collections.ARCHIVE);
    const customersCollection = await getCollection(Collections.CUSTOMERS_DATABASE);
    const records = await archiveCollection.find({ id: { $in: body.recordIds || [] } }).toArray();
    if (records.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No records found to restore' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const restored = records.map((record: any) => ({ ...(record.entityData || record.data || record), restoredAt: new Date().toISOString() }));
    await customersCollection.insertMany(restored);
    await archiveCollection.deleteMany({ id: { $in: body.recordIds || [] } });
    return new Response(JSON.stringify({ success: true, restoredCount: restored.length }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/database/customers/assigned/') && method === 'GET') {
    const agentId = path.replace('/database/customers/assigned/', '');
    const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
    const customers = await collection.find({ assignedTo: agentId }).toArray();
    return new Response(JSON.stringify({ success: true, customers: convertMongoDocs(customers) }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/database/customers/') && method === 'DELETE') {
    const id = path.split('/').pop();
    const collection = await getCollection(Collections.CUSTOMERS_DATABASE);
    await collection.deleteOne({ id });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // assignments
  if (path === '/assignments' && method === 'GET') {
    const agentId = url.searchParams.get('agentId');
    const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const assignments = await collection.find(agentId ? { agentId } : {}).sort({ assignedAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, assignments: convertMongoDocs(assignments), count: assignments.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (path === '/assignments/claim' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    const assignment = await collection.findOne({ id: body.assignmentId });
    if (!assignment) return new Response(JSON.stringify({ success: false, error: 'Assignment not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    await collection.updateOne({ id: body.assignmentId }, { $set: { claimedBy: body.agentId, claimedAt: new Date().toISOString(), status: 'claimed' } });
    return new Response(JSON.stringify({ success: true, message: 'Assignment claimed successfully' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/assignments/mark-called' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.NUMBER_ASSIGNMENTS);
    await collection.updateOne({ id: body.assignmentId }, { $set: { called: true, calledAt: new Date().toISOString(), outcome: body.outcome || 'completed' } });
    return new Response(JSON.stringify({ success: true, message: 'Assignment updated' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Call progress / call tracker routes
  if (path === '/call-progress' && method === 'GET') return callProgressRoutes.getCallProgress(req);
  if (path === '/call-progress/recycle' && method === 'POST') return callProgressRoutes.recycleUncompletedCalls(req);
  if (path === '/call-progress/archive-completed' && method === 'POST') return callProgressRoutes.archiveCompletedCalls(req);
  if (path === '/call-progress/recycle-agent' && method === 'POST') return callProgressRoutes.recycleAgentNumbers(req);

  // Special database routes
  if (path === '/special-database' && method === 'GET') return specialDbRoutes.getSpecialNumbers(req, path, url);
  if (path === '/special-database/upload' && method === 'POST') return specialDbRoutes.uploadNumbers(req);
  if (path === '/special-database/assign' && method === 'POST') return specialDbRoutes.assignNumbers(req);
  if (path.startsWith('/special-database/') && method === 'DELETE') return specialDbRoutes.deleteNumber(req, path);
  if (path === '/special-database/archive' && method === 'GET') return specialDbRoutes.getArchive(req);
  if (path === '/special-database/recycle' && method === 'POST') return specialDbRoutes.recycleNumbers(req);
  if (path === '/special-database/complete-call' && method === 'POST') return specialDbRoutes.completeCall(req);
  if (path === '/special-database/migrate-assignments' && method === 'POST') return specialDbRoutes.migrateAssignments(req);

  // call logs and scripts
  if (path === '/call-logs' && method === 'GET') {
    const agentId = url.searchParams.get('agentId');
    const collection = await getCollection(Collections.CALL_LOGS);
    const logs = await collection.find(agentId ? { agentId } : {}).sort({ callTime: -1 }).limit(500).toArray();
    return new Response(JSON.stringify({ success: true, logs: convertMongoDocs(logs) }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/call-logs' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.CALL_LOGS);
    const log = { ...body, id: body.id || generateId(), callTime: body.callTime || new Date().toISOString() };
    await collection.insertOne(log);
    return new Response(JSON.stringify({ success: true, log }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/call-scripts' && method === 'GET') {
    const collection = await getCollection(Collections.CALL_SCRIPTS);
    const scripts = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, scripts: convertMongoDocs(scripts) }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/call-scripts' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.CALL_SCRIPTS);
    const script = { ...body, id: body.id || generateId(), createdAt: new Date().toISOString(), isActive: !!body.isActive };
    await collection.insertOne(script);
    return new Response(JSON.stringify({ success: true, script }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/call-scripts/') && path.endsWith('/activate') && method === 'POST') {
    const scriptId = path.split('/')[2];
    const collection = await getCollection(Collections.CALL_SCRIPTS);
    await collection.updateMany({}, { $set: { isActive: false } });
    await collection.updateOne({ id: scriptId }, { $set: { isActive: true } });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/call-scripts/') && method === 'DELETE') {
    const scriptId = path.split('/')[2];
    const collection = await getCollection(Collections.CALL_SCRIPTS);
    await collection.deleteOne({ id: scriptId });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/call-scripts/active/') && method === 'GET') {
    const type = path.split('/').pop() || '';
    const collection = await getCollection(Collections.CALL_SCRIPTS);
    const script = await collection.findOne({ type, isActive: true });
    return new Response(JSON.stringify({ success: true, script: script ? convertMongoDoc(script) : null }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // settings & email
  if (path === '/smtp-settings' && method === 'GET') {
    const collection = await getCollection(Collections.SMTP_SETTINGS);
    const settings = await collection.findOne({ type: 'smtp' });
    return new Response(JSON.stringify({ success: true, settings: settings ? convertMongoDoc(settings) : {} }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/smtp-settings' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.SMTP_SETTINGS);
    await collection.updateOne({ type: 'smtp' }, { $set: { ...body, type: 'smtp', updatedAt: new Date().toISOString() } }, { upsert: true });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/smtp-test' && method === 'POST') {
    return new Response(JSON.stringify({ success: true, message: 'SMTP test email sent successfully (MongoDB)' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/email-recipients' && method === 'GET') {
    const collection = await getCollection(Collections.EMAIL_RECIPIENTS);
    const recipients = await collection.findOne({ type: 'email-recipients' });
    return new Response(JSON.stringify({ success: true, recipients: recipients?.recipients || [] }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/email-recipients' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.EMAIL_RECIPIENTS);
    await collection.updateOne({ type: 'email-recipients' }, { $set: { recipients: body.recipients || [], updatedAt: new Date().toISOString(), type: 'email-recipients' } }, { upsert: true });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/threecx-settings' && method === 'GET') {
    const collection = await getCollection(Collections.THREECX_SETTINGS);
    const settings = await collection.findOne({ type: '3cx' });
    return new Response(JSON.stringify({ success: true, settings: settings ? convertMongoDoc(settings) : {} }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/threecx-settings' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.THREECX_SETTINGS);
    await collection.updateOne({ type: '3cx' }, { $set: { ...body, type: '3cx', updatedAt: new Date().toISOString() } }, { upsert: true });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // progress, promotions, archive, claims
  if (path === '/daily-progress' && method === 'GET') {
    const collection = await getCollection(Collections.DAILY_PROGRESS);
    const progress = await collection.findOne({ type: 'daily' });
    return new Response(JSON.stringify({ success: true, progress: progress ? convertMongoDoc(progress) : { type: 'daily', userProgress: {}, lastReset: new Date().toISOString() } }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/daily-progress' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.DAILY_PROGRESS);
    await collection.updateOne({ type: 'daily' }, { $set: { [`userProgress.${body.userId}`]: { callsToday: body.callsToday, lastCallTime: body.lastCallTime || new Date().toISOString(), updatedAt: new Date().toISOString() } } }, { upsert: true });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/daily-progress/check-reset' && method === 'GET') {
    return new Response(JSON.stringify({ success: true, wasReset: false }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/daily-progress/reset' && method === 'POST') {
    const collection = await getCollection(Collections.DAILY_PROGRESS);
    await collection.updateOne({ type: 'daily' }, { $set: { userProgress: {}, lastReset: new Date().toISOString() } }, { upsert: true });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/promotions' && method === 'GET') {
    const collection = await getCollection(Collections.PROMOTIONS);
    const promotions = await collection.find({}).toArray();
    return new Response(JSON.stringify({ success: true, promotions: convertMongoDocs(promotions) }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/promotions' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.PROMOTIONS);
    const promotion = { ...body, id: body.id || generateId(), createdAt: new Date().toISOString() };
    await collection.insertOne(promotion);
    return new Response(JSON.stringify({ success: true, promotion }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/promotions/') && method === 'PUT') {
    const id = path.split('/').pop();
    const body = await req.json();
    const collection = await getCollection(Collections.PROMOTIONS);
    await collection.updateOne({ id }, { $set: { ...body, updatedAt: new Date().toISOString() } });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path.startsWith('/promotions/') && method === 'DELETE') {
    const id = path.split('/').pop();
    const collection = await getCollection(Collections.PROMOTIONS);
    await collection.deleteOne({ id });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/archive' && method === 'GET') {
    const type = url.searchParams.get('type');
    const collection = await getCollection(Collections.ARCHIVE);
    const archives = await collection.find(type ? { entityType: type } : {}).sort({ archivedAt: -1 }).toArray();
    return new Response(JSON.stringify({ success: true, archives: convertMongoDocs(archives) }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/archive' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.ARCHIVE);
    const archiveEntry = { ...body, id: body.id || generateId(), archivedAt: new Date().toISOString() };
    await collection.insertOne(archiveEntry);
    return new Response(JSON.stringify({ success: true, archive: archiveEntry }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/archive/restore' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.ARCHIVE);
    const archivedItem = await collection.findOne({ id: body.recordId || body.archiveId });
    if (!archivedItem) return new Response(JSON.stringify({ success: false, error: 'Archived item not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    await collection.deleteOne({ id: archivedItem.id });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/archive/delete' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.ARCHIVE);
    await collection.deleteOne({ id: body.recordId });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/number-claims' && method === 'GET') {
    const collection = await getCollection(Collections.NUMBER_CLAIMS);
    const claims = await collection.find({}).toArray();
    const claimsMap: Record<string, any> = {};
    claims.forEach((claim: any) => { claimsMap[claim.phoneNumber] = claim; });
    return new Response(JSON.stringify({ success: true, claims: claimsMap }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/claim-number' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.NUMBER_CLAIMS);
    await collection.updateOne({ phoneNumber: body.phoneNumber }, { $set: { ...body, claimedAt: new Date().toISOString(), expiresAt: Date.now() + 5 * 60 * 1000 } }, { upsert: true });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/release-number' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.NUMBER_CLAIMS);
    await collection.deleteOne({ phoneNumber: body.phoneNumber, userId: body.userId });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/extend-number-claim' && method === 'POST') {
    const body = await req.json();
    const collection = await getCollection(Collections.NUMBER_CLAIMS);
    await collection.updateOne({ phoneNumber: body.phoneNumber, userId: body.userId }, { $set: { expiresAt: Date.now() + 5 * 60 * 1000 } });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if (path === '/database/reset-all' && method === 'POST') {
    const collectionsToClear = [Collections.NUMBERS_DATABASE, Collections.CUSTOMERS_DATABASE, Collections.NUMBER_ASSIGNMENTS, Collections.CALL_SCRIPTS, Collections.PROMOTIONS, Collections.ARCHIVE, Collections.CALL_LOGS, Collections.DAILY_PROGRESS, Collections.EMAIL_RECIPIENTS, Collections.SMTP_SETTINGS, Collections.THREECX_SETTINGS, Collections.NUMBER_CLAIMS];
    let deletedCount = 0;
    for (const collectionName of collectionsToClear) {
      const collection = await getCollection(collectionName);
      const result = await collection.deleteMany({});
      deletedCount += result.deletedCount || 0;
    }
    return new Response(JSON.stringify({ success: true, message: 'Database reset complete', deletedCount }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  
  return new Response(JSON.stringify({ success: false, error: 'Endpoint not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}



Deno.serve({ port: 8000, hostname: "0.0.0.0" }, async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

// // console.log(`[SERVER] ${req.method} ${path} - ${new Date().toISOString()}`);

  try {
    return await handleRequest(req);
  } catch (error: any) {
    console.error('[SERVER] Unhandled error in router:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
    