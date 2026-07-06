import { corsHeaders, generateId } from '../lib/common.ts';
import { getCollection, Collections } from '../mongodb.tsx';
import { convertMongoDoc } from '../mongodb.tsx';
import { checkMongoReady } from '../lib/db.ts';
import { hashPassword, verifyPassword } from '../lib/password.ts';

export async function login(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const rawUsername = typeof body?.username === 'string' ? body.username : '';
    const rawPassword = typeof body?.password === 'string' ? body.password : '';
    const username = rawUsername.trim();
    const password = rawPassword.trim();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const collection = await getCollection(Collections.USERS);
    const normalizedUsername = username.toLowerCase();
    const user = await collection.findOne({
      username: {
        $regex: `^${normalizedUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        $options: 'i'
      }
    });

    const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
    const passwordMatches = user ? await verifyPassword(password, user.password) : false;
    if (!user || !passwordMatches) {
      await auditCollection.insertOne({
        id: generateId(),
        username,
        success: false,
        timestamp: new Date().toISOString(),
        reason: user ? 'invalid_password' : 'user_not_found'
      });

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid username or password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof user.password === 'string' && !user.password.startsWith('sha256$') && passwordMatches) {
      await collection.updateOne(
        { _id: user._id },
        { $set: { password: await hashPassword(password), updatedAt: new Date().toISOString() } }
      );
    }

    // successful login
    await auditCollection.insertOne({
      id: generateId(),
      userId: user.id,
      username: user.username,
      success: true,
      timestamp: new Date().toISOString()
    });

    const { password: _, ...userWithoutPassword } = user;
    console.log(`[AUTH] ✅ User logged in: ${user.username} (${user.role})`);
    return new Response(
      JSON.stringify({ success: true, user: convertMongoDoc(userWithoutPassword) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[AUTH] Login error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
