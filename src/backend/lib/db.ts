import { initializeDatabase, getMongoDb } from '../mongodb.tsx';
import { corsHeaders } from './common.ts';

let mongoInitialized = false;
let mongoInitializing = false;
let mongoInitPromise: Promise<void> | null = null;

export async function ensureMongoInitialized(): Promise<void> {
  if (mongoInitialized) {
    return;
  }
  if (mongoInitPromise) {
    await mongoInitPromise;
    return;
  }

  mongoInitPromise = (async () => {
    try {
      mongoInitializing = true;
      console.log('[MongoDB] Initializing database...');
      await initializeDatabase();
      mongoInitialized = true;
      mongoInitializing = false;
      console.log('[MongoDB] ✅ Connected and ready!');
    } catch (error) {
      mongoInitializing = false;
      mongoInitialized = false;
      console.error('[MongoDB] ❌ Initialization failed:', error);
      throw error;
    }
  })();

  await mongoInitPromise;
}

export function isMongoInitialized() {
  return mongoInitialized;
}

export function isMongoInitializing() {
  return mongoInitializing;
}

export async function checkMongoReady(): Promise<Response | null> {
  if (mongoInitialized) {
    return null;
  }

  if (mongoInitializing) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Database connection not ready yet. Please refresh the page in a moment.',
        status: 'not_initialized',
        message: 'MongoDB is currently initializing. This typically takes 10-30 seconds.'
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    await ensureMongoInitialized();
    return null;
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Database not ready',
        status: 'error',
        details: error.message,
        message: 'Failed to connect to MongoDB. Please check your internet connection and try again.'
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// start initialization in background
console.log('🔧 Starting MongoDB initialization in background...');
(async () => {
  try {
    await ensureMongoInitialized();
  } catch (error) {
    console.error('⚠️ Initial MongoDB connection failed:', error);
    console.log('⏳ Will retry on first request...');
  }
})();

// re-export helper for controllers
export { getMongoDb };
