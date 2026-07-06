// BTM Travel CRM Backend - Setup and Initialization Endpoints
// Database setup and initialization endpoints

import { corsHeaders } from './config.ts';
import { checkMongoReady } from './mongodb-init.ts';
import { getCollection, Collections } from './mongodb.tsx';

// Setup endpoint to initialize default admin user
export async function handleSetupInit(req: Request): Promise<Response> {
  try {
    const collection = await getCollection(Collections.USERS);

    // Check if admin already exists
    const existingAdmin = await collection.findOne({ username: 'admin' });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Default admin user already exists',
          message: 'Admin user is already initialized. Use the existing admin credentials to log in.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create default admin user
    const adminUser = {
      id: 'admin-1',
      username: 'admin',
      name: 'Administrator',
      email: 'admin@btmtravel.net',
      password: 'admin123',
      role: 'admin',
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await collection.insertOne(adminUser);

    console.log('[SETUP] ✅ Default admin user created');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Default admin user created successfully',
        credentials: {
          username: 'admin',
          password: 'admin123'
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[SETUP] Error creating admin:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Debug endpoint to list all users (with passwords for debugging)
export async function handleDebugUsers(req: Request): Promise<Response> {
  try {
    const collection = await getCollection(Collections.USERS);
    const users = await collection.find({}).toArray();
    return new Response(
      JSON.stringify({
        success: true,
        count: users.length,
        users: users.map(u => ({
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
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Debug endpoint to verify manager endpoints exist
export async function handleDebugManagerEndpoints(req: Request): Promise<Response> {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Manager endpoints diagnostic',
      version: SERVER_VERSION,
      serverStarted: SERVER_STARTED,
      mongoStatus: {
        initialized: mongoInitialized,
        initializing: mongoInitializing
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