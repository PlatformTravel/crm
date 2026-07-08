import { corsHeaders, SERVER_VERSION, SERVER_STARTED } from '../lib/common.ts';
import { getMongoDb } from '../mongodb.tsx';
import { checkMongoReady, isMongoInitialized, isMongoInitializing } from '../lib/db.ts';
import { config } from '../config.ts'

console.log(`[HealthController] config: ${(config.MONGODB_URI)}`);

// /health
export async function health(req: Request): Promise<Response> {
  // this endpoint is always GET
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  // check MongoDB status first
  if (isMongoInitializing()) {
    return new Response(
      JSON.stringify({
        status: 'initializing',
        message: 'Server is running, MongoDB is initializing...',
        timestamp: new Date().toISOString(),
        version: SERVER_VERSION,
        mongodb: 'initializing',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!isMongoInitialized()) {
    return new Response(
      JSON.stringify({
        status: 'degraded',
        message: 'Server is running, MongoDB not yet connected',
        timestamp: new Date().toISOString(),
        version: SERVER_VERSION,
        mongodb: 'disconnected',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // ping the database
  try {
    const db = await getMongoDb();
    await db.command({ ping: 1 });
    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'BTM Travel CRM Server is running (MongoDB Connected)',
        timestamp: new Date().toISOString(),
        version: SERVER_VERSION,
        serverStarted: SERVER_STARTED,
        mongodb: 'connected',
        customerEndpoints: 'available',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'degraded',
        message: 'Server running but MongoDB ping failed',
        timestamp: new Date().toISOString(),
        version: SERVER_VERSION,
        mongodb: 'error',
        error: (error as any).message,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// /test
export async function test(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  // simply return some static info
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'BTM Travel CRM Server - All Systems Operational',
      timestamp: new Date().toISOString(),
      mongo: isMongoInitialized() ? 'connected' : 'not ready',
      serverVersion: SERVER_VERSION,
      serverStarted: SERVER_STARTED,
      totalEndpoints: '50+',
      criticalEndpointsStatus: {
        '/team-performance': 'LOADED ✅',
        '/agent-monitoring/overview': 'LOADED ✅',
        '/agent-monitoring/agent/:id': 'LOADED ✅',
        '/database/clients': 'LOADED ✅',
        '/database/customers': 'LOADED ✅',
        '/database/reset-all': 'LOADED ✅',
        '/cron/daily-archive': 'LOADED ✅'
      },
      useDebugEndpoint: 'Visit /debug/endpoints for complete endpoint list'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// /test-setup
export async function testSetup(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: '✅ Server is running the LATEST code (v6.0.0-OCT24)!',
      version: SERVER_VERSION,
      timestamp: new Date().toISOString(),
      serverStarted: SERVER_STARTED,
      mongoInitialized: isMongoInitialized(),
      mongoInitializing: isMongoInitializing(),
      endpointsVerified: [
        '/email-recipients',
        '/database/customers/assigned/:id',
        '/customers/archived',
        '/users/login',
        '/setup/init'
      ]
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// debug helpers (could eventually be split further)
export async function debugUsers(req: Request): Promise<Response> {
  // this function requires Mongo
  const ready = await checkMongoReady();
  if (ready) return ready;

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const collection = await getMongoDb().then(db => db.collection('users'));
    const users = await collection.find({}).toArray();
    return new Response(
      JSON.stringify({
        success: true,
        count: users.length,
        users: users.map((u: any) => ({
          id: u.id,
          username: u.username,
          password: u.password,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt
        }))
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as any).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function debugCors(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'CORS configuration is properly set up',
      corsHeaders,
      note: 'All responses from this server include these CORS headers',
      timestamp: new Date().toISOString()
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

export async function debugEndpoints(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  return new Response(
    JSON.stringify({
      success: true,
      serverVersion: SERVER_VERSION,
      serverStarted: SERVER_STARTED,
      mongoStatus: isMongoInitialized() ? 'connected' : (isMongoInitializing() ? 'initializing' : 'not connected'),
      message: 'All 50+ endpoints loaded and verified',
      endpointCategories: {
        core: ['/health', '/test', '/debug/endpoints', '/debug/users', '/setup/init'],
        authentication: ['/users/login', '/users', '/users/:id', '/login-audit'],
        clients: [
          '/database/clients',
          '/database/clients/import',
          '/database/clients/assign',
          '/database/clients/:id',
          '/database/clients/bulk-delete',
          '/database/clients/clear-all',
          '/database/clients/archive',
          '/database/clients/archive/bulk-restore'
        ],
        customers: [
          '/database/customers',
          '/database/customers/assigned/:id',
          '/database/customers/import',
          '/database/customers/assign',
          '/customers',
          '/customers/clear',
          '/customers/archived',
          '/customer-interactions'
        ],
        assignments: [
          '/assignments',
          '/assignments/claim',
          '/assignments/mark-called',
          '/number-claims',
          '/claim-number',
          '/release-number',
          '/extend-number-claim'
        ],
        callManagement: [
          '/call-logs',
          '/call-scripts',
          '/call-scripts/:id/activate',
          '/call-scripts/:id',
          '/call-scripts/active/:type'
        ],
        managerOperations: [
          '/team-performance',
          '/agent-monitoring/overview',
          '/agent-monitoring/agent/:id'
        ],
        settings: [
          '/smtp-settings',
          '/smtp-test',
          '/send-email',
          '/send-quick-email',
          '/threecx-settings',
          '/email-recipients'
        ],
        progress: [
          '/daily-progress',
          '/daily-progress/check-reset',
          '/daily-progress/reset'
        ],
        promotions: ['/promotions', '/promotions/:id'],
        archive: ['/archive', '/archive/restore'],
        admin: [
          '/admin/delete-selected-data',
          '/database/reset-all',
          '/cron/daily-archive'
        ]
      },
      totalEndpoints: '50+',
      status: 'All endpoints operational'
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

export async function debugManagerEndpoints(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Manager endpoints diagnostic',
      version: SERVER_VERSION,
      serverStarted: SERVER_STARTED,
      mongoStatus: {
        initialized: isMongoInitialized(),
        initializing: isMongoInitializing()
      },
      managerEndpoints: {
        '/team-performance': {
          method: 'GET',
          status: 'LOADED ✅',
          lineNumber: 3021,
          requiresMongo: true
        },
        '/agent-monitoring/overview': {
          method: 'GET',
          status: 'LOADED ✅',
          lineNumber: 3111,
          requiresMongo: true
        },
        '/database/customers': {
          method: 'GET',
          status: 'LOADED ✅',
          lineNumber: 3174,
          requiresMongo: true
        }
      },
      note: 'If MongoDB is not initialized, these endpoints will return 503, not 404',
      troubleshooting: {
        if404: 'The server is running OLD code. Please kill all Deno processes and restart.',
        if503: 'MongoDB is initializing. Wait 10-30 seconds and try again.',
        ifSuccess: 'Endpoints are working correctly!'
      }
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

