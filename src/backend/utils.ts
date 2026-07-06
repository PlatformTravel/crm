// Common utilities for backend route modules

export { getCollection, Collections, convertMongoDoc, convertMongoDocs, getMongoDb, initializeDatabase } from './mongodb.tsx';

// Re-export types if needed

// Export other shared constants/functions (could be moved from server1.ts)
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours preflight cache
};

// Server version information can be imported by other modules if needed
export const SERVER_VERSION = '9.3.0-ASSIGNMENTS-FIX';
export const SERVER_STARTED = new Date().toISOString();

export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function determineAgentStatus(lastActivityTime?: string): 'active' | 'idle' | 'offline' {
  if (!lastActivityTime) return 'offline';
  const lastActivity = new Date(lastActivityTime);
  const now = new Date();
  const minutesSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
  if (minutesSinceActivity < 5) return 'active';
  if (minutesSinceActivity < 30) return 'idle';
  return 'offline';
}

// Database initialization helpers can also be exported here if controllers need them
export { ensureMongoInitialized, checkMongoReady, isMongoInitialized, isMongoInitializing } from './lib/db.ts';
