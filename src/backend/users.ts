// BTM Travel CRM Backend - User Management Endpoints
// User CRUD operations, authentication, and login audit

import { corsHeaders, generateId } from './config.ts';
import { checkMongoReady } from './mongodb-init.ts';
import { getCollection, Collections } from './mongodb.tsx';
import { convertMongoDocs, convertMongoDoc } from './mongodb.tsx';

export async function handleUsersGet(req: Request): Promise<Response> {
  console.log('[USERS] Get all users requested');

  // Check MongoDB ready
  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const collection = await getCollection(Collections.USERS);
    const users = await collection.find({}).toArray();

    // Remove passwords from response
    const sanitizedUsers = users.map((u: any) => {
      const { password, ...rest } = u;
      return convertMongoDoc(rest);
    });

    // Also provide agents list (users with role === 'Agent')
    const agents = sanitizedUsers.filter((u: any) => u.role === 'Agent');

    return new Response(
      JSON.stringify({
        success: true,
        users: sanitizedUsers,
        agents: agents  // Include agents for easy filtering
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error fetching users:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function handleUsersPost(req: Request): Promise<Response> {
  console.log('[USERS] Create user requested');

  // Check MongoDB ready
  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const { username, name, email, password, role, permissions, dailyTarget } = body;

    if (!username || !name || !password || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: username, name, password, role'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const collection = await getCollection(Collections.USERS);

    // Check if username already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Username already exists'
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newUser = {
      id: generateId(),
      username,
      name,
      email: email || '',
      password,
      role,
      permissions: permissions || [],
      dailyTarget: dailyTarget || 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await collection.insertOne(newUser);

    console.log(`[USERS] ✅ User created: ${username} (${role})`);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return new Response(
      JSON.stringify({
        success: true,
        user: convertMongoDoc(userWithoutPassword),
        message: 'User created successfully'
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error creating user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function handleUsersPut(req: Request, path: string): Promise<Response> {
  const userId = path.split('/users/')[1];
  console.log(`[USERS] Update user requested: ${userId}`);

  // Check MongoDB ready
  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const { name, email, password, role, permissions, dailyTarget } = body;

    const collection = await getCollection(Collections.USERS);

    const updateDoc: any = {
      updatedAt: new Date().toISOString()
    };

    if (name) updateDoc.name = name;
    if (email !== undefined) updateDoc.email = email;
    if (password) updateDoc.password = password;
    if (role) updateDoc.role = role;
    if (permissions !== undefined) updateDoc.permissions = permissions;
    if (dailyTarget !== undefined) updateDoc.dailyTarget = dailyTarget;

    const result = await collection.updateOne(
      { id: userId },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User not found'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[USERS] ✅ User updated: ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User updated successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error updating user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function handleUsersDelete(req: Request, path: string): Promise<Response> {
  const userId = path.split('/users/')[1];
  console.log(`[USERS] Delete user requested: ${userId}`);

  // Check MongoDB ready
  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const collection = await getCollection(Collections.USERS);

    // Prevent deleting the default admin
    const user = await collection.findOne({ id: userId });
    if (user && user.id === 'admin-1') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Cannot delete the default admin user'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await collection.deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User not found'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[USERS] ✅ User deleted: ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User deleted successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[USERS] Error deleting user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function handleUsersLogin(req: Request): Promise<Response> {
  console.log('[AUTH] Login attempt');

  // Check MongoDB ready
  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Username and password are required'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const collection = await getCollection(Collections.USERS);
    const user = await collection.findOne({ username });

    if (!user || user.password !== password) {
      // Log failed login attempt
      const auditCollection = await getCollection(Collections.LOGIN_AUDIT);
      await auditCollection.insertOne({
        id: generateId(),
        username,
        success: false,
        timestamp: new Date().toISOString(),
        reason: user ? 'invalid_password' : 'user_not_found'
      });

      console.log(`[AUTH] ❌ Login failed for: ${username}`);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid username or password'
        }),
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
      timestamp: new Date().toISOString()
    });

    console.log(`[AUTH] ✅ Login successful: ${username} (${user.role})`);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        success: true,
        user: convertMongoDoc(userWithoutPassword)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[AUTH] Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function handleLoginAudit(req: Request): Promise<Response> {
  console.log('[AUDIT] Get login audit logs');

  // Check MongoDB ready
  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const collection = await getCollection(Collections.LOGIN_AUDIT);
    const logs = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();

    return new Response(
      JSON.stringify({
        success: true,
        logs: convertMongoDocs(logs)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[AUDIT] Error fetching logs:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}