import { corsHeaders, generateId } from '../lib/common.ts';
import { getCollection, Collections } from '../mongodb.tsx';
import { convertMongoDoc } from '../mongodb.tsx';
import { checkMongoReady } from '../lib/db.ts';
import { hashPassword, verifyPassword } from '../lib/password.ts';

export async function registerAgent(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const username = String(body?.username || '').trim().toLowerCase();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!username || !name || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username, name, and password are required',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username can only contain letters, numbers, and underscores',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ success: false, error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Enter a valid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const collection = await getCollection(Collections.USERS);
    const existingUsername = await collection.findOne({ username: { $regex: `^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
    if (existingUsername) {
      return new Response(JSON.stringify({ success: false, error: 'Username already exists' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (email) {
      const existingEmail = await collection.findOne({ email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
      if (existingEmail) {
        return new Response(JSON.stringify({ success: false, error: 'Email already exists' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const newUser = {
      id: generateId(),
      username,
      name,
      email,
      password: await hashPassword(password),
      role: 'agent',
      permissions: [],
      dailyTarget: 30,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await collection.insertOne(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    return new Response(JSON.stringify({
      success: true,
      user: convertMongoDoc(userWithoutPassword),
      message: 'Agent registered successfully',
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[AUTH] Agent registration error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error?.message || 'Registration failed',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

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
