// BTM Travel CRM Backend - Configuration
// Constants and configuration for the CRM server


export const config = {
  MONGODB_URI: Deno.env.get("MONGODB_URI"),
  MONGODB_DB: Deno.env.get("MONGODB_DB"),
  BACKEND_URL: Deno.env.get("FRONTEND_URL"),
};

// Comprehensive CORS configuration for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours preflight cache
};

// Server version and startup timestamp
export const SERVER_VERSION = '9.3.0-ASSIGNMENTS-FIX';
export const SERVER_STARTED = new Date().toISOString();

// Helper to generate unique IDs
export const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to determine agent status based on last activity
export function determineAgentStatus(lastActivityTime?: string): 'active' | 'idle' | 'offline' {
  if (!lastActivityTime) return 'offline';

  const lastActivity = new Date(lastActivityTime);
  const now = new Date();
  const minutesSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

  if (minutesSinceActivity < 5) return 'active';
  if (minutesSinceActivity < 30) return 'idle';
  return 'offline';
}