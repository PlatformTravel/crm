// Compatibility entrypoint for the CRM backend.
// This forwards requests to the same Deno router used by the local backend server so
// the Supabase function and local server stay in sync.
import { handleRequest } from '../../../backend/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function normalizeRequest(req: Request): Request {
  const url = new URL(req.url);
  const prefix = '/functions/v1/make-server-8fff4b3c';
  let pathname = url.pathname;

  if (pathname.startsWith(prefix)) {
    pathname = pathname.slice(prefix.length) || '/';
    url.pathname = pathname;
  }

  return new Request(url.toString(), req);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await handleRequest(normalizeRequest(req));
  } catch (error: any) {
    console.error('[SUPABASE-FUNCTION] Unhandled error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
