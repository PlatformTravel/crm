import { corsHeaders, generateId } from '../lib/common.ts';
import { getCollection, Collections, convertMongoDoc } from '../mongodb.tsx';
import { checkMongoReady } from '../lib/db.ts';
import { hashPassword } from '../lib/password.ts';

export async function listUsers(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const collection = await getCollection(Collections.USERS);
    const users = await collection.find({}).toArray();
    const sanitizedUsers = users.map((u: any) => {
      const { password, ...rest } = u;
      return convertMongoDoc(rest);
    });
    const agents = sanitizedUsers.filter((u: any) => String(u.role || '').toLowerCase() === 'agent');
    return new Response(
      JSON.stringify({ success: true, users: sanitizedUsers, agents }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error fetching users:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function createUser(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const { username, name, email, password, role, permissions, dailyTarget } = body;
    if (!username || !name || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: username, name, password, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const collection = await getCollection(Collections.USERS);
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username already exists' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newUser = {
      id: generateId(),
      username,
      name,
      email: email || '',
      password: await hashPassword(password),
      role,
      permissions: permissions || [],
      dailyTarget: dailyTarget || 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await collection.insertOne(newUser);
    console.log(`[USERS] ✅ User created: ${username} (${role})`);

    const { password: _, ...userWithoutPassword } = newUser;
    return new Response(
      JSON.stringify({ success: true, user: convertMongoDoc(userWithoutPassword), message: 'User created successfully' }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error creating user:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function updateUser(req: Request, userId?: string): Promise<Response> {
  if (req.method !== 'PUT') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!userId) {
    return new Response(JSON.stringify({ success: false, error: 'User id missing' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const { name, email, password, role, permissions, dailyTarget } = body;
    const collection = await getCollection(Collections.USERS);
    const updateDoc: any = { updatedAt: new Date().toISOString() };
    if (name) updateDoc.name = name;
    if (email !== undefined) updateDoc.email = email;
    if (password) updateDoc.password = await hashPassword(password);
    if (role) updateDoc.role = role;
    if (permissions !== undefined) updateDoc.permissions = permissions;
    if (dailyTarget !== undefined) updateDoc.dailyTarget = dailyTarget;

    const result = await collection.updateOne({ id: userId }, { $set: updateDoc });
    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[USERS] ✅ User updated: ${userId}`);
    return new Response(
      JSON.stringify({ success: true, message: 'User updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error updating user:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function deleteUser(req: Request, userId?: string): Promise<Response> {
  if (req.method !== 'DELETE') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!userId) {
    return new Response(JSON.stringify({ success: false, error: 'User id missing' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const collection = await getCollection(Collections.USERS);
    const user = await collection.findOne({ id: userId });
    if (user && user.id === 'admin-1') {
      return new Response(
        JSON.stringify({ success: false, error: 'Cannot delete the default admin user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await collection.deleteOne({ id: userId });
    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[USERS] ✅ User deleted: ${userId}`);
    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error deleting user:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
