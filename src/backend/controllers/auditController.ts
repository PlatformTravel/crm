import { corsHeaders } from '../lib/common.ts';
import { getCollection, Collections, convertMongoDocs } from '../mongodb.tsx';
import { checkMongoReady } from '../lib/db.ts';

export async function getLoginAudit(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const readyCheck = await checkMongoReady();
  if (readyCheck) return readyCheck;

  try {
    const collection = await getCollection(Collections.LOGIN_AUDIT);
    const logs = await collection.find({}).sort({ timestamp: -1 }).limit(100).toArray();
    return new Response(
      JSON.stringify({ success: true, logs: convertMongoDocs(logs) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[AUDIT] Error fetching logs:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function recordLoginAttempt(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const collection = await getCollection(Collections.LOGIN_AUDIT);
    await collection.insertOne({
      id: crypto.randomUUID(),
      ...body,
      timestamp: new Date().toISOString(),
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

