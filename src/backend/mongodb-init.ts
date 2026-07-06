// BTM Travel CRM Backend - MongoDB Initialization
// MongoDB connection and initialization logic

import { getCollection, Collections, initializeDatabase, convertMongoDoc, convertMongoDocs, getMongoDb } from './mongodb.tsx';

// Track MongoDB initialization status
let mongoInitialized = false;
let mongoInitializing = false;
let mongoInitPromise: Promise<void> | null = null;

// Helper function to ensure MongoDB is initialized
export async function ensureMongoInitialized(): Promise<void> {
  if (mongoInitialized) {
    return;
  }

  if (mongoInitPromise) {
    // Wait for existing initialization to complete
    await mongoInitPromise;
    return;
  }

  // Start new initialization
  mongoInitPromise = (async () => {
    try {
      mongoInitializing = true;
      await initializeDatabase();
      mongoInitialized = true;
      mongoInitializing = false;
    } catch (error) {
      mongoInitializing = false;
      mongoInitialized = false;
      throw error;
    }
  })();

  await mongoInitPromise;
}

// Helper function to check if MongoDB is ready (with auto-init)
export async function checkMongoReady(): Promise<Response | null> {
  if (mongoInitialized) {
    return null; // MongoDB is ready
  }

  // If currently initializing, return a friendly message
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
    // Try to initialize if not already doing so
    await ensureMongoInitialized();
    return null; // MongoDB is now ready
  } catch (error:any) {
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

// Initialize MongoDB in the background (non-blocking)
(async () => {
  try {
    await ensureMongoInitialized();
  } catch (error) {
    console.error('⚠️ Initial MongoDB connection failed:', error);
    console.log('⏳ Will retry on first request...');
  }
})();