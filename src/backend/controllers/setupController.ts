import { corsHeaders } from '../lib/common.ts';
import { getCollection, Collections } from '../mongodb.tsx';
import { checkMongoReady } from '../lib/db.ts';

export async function initialize(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // ensure mongo connection is ready
  const ready = await checkMongoReady();
  if (ready) return ready;

  try {
    const collection = await getCollection(Collections.USERS);
    const userCount = await collection.countDocuments();

    if (userCount === 0) {
      console.log('[SETUP] No users found, creating default admin user...');
      await collection.insertOne({
        id: 'admin-1',
        username: 'admin',
        name: 'Administrator',
        email: 'admin@btmtravel.net',
        password: 'admin123',
        role: 'admin',
        permissions: [],
        createdAt: new Date().toISOString(),
      });
      console.log('[SETUP] ✅ Default admin user created (username: admin, password: admin123)');

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
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          message: `Database already initialized with ${userCount} user(s)`,
          userCount
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('[SETUP] Error initializing:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
