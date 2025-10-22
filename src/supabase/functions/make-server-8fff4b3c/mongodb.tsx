// MongoDB Connection Utility for BTM Travel CRM
import { MongoClient, Db, Collection } from 'npm:mongodb@6.3.0';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Get MongoDB connection
 * Uses connection pooling and caching for performance
 */
export async function getMongoDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  // Hardcoded MongoDB connection string
  const MONGODB_URI = 'mongodb+srv://crm_db_user:y7eShqCFNoyfSLPb@cluster0.vlklc6c.mongodb.net/btm_travel_crm?retryWrites=true&w=majority';

  console.log('[MongoDB] Connecting to database...');

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  cachedClient = client;
  cachedDb = client.db('btm_travel_crm');

  console.log('[MongoDB] ✅ Connected successfully');

  return cachedDb;
}

/**
 * Get a specific collection
 */
export async function getCollection<T = any>(collectionName: string): Promise<Collection<T>> {
  const db = await getMongoDb();
  return db.collection<T>(collectionName);
}

/**
 * Collection names used in the application
 */
export const Collections = {
  USERS: 'users',
  SMTP_SETTINGS: 'smtp_settings',
  THREECX_SETTINGS: 'threecx_settings',
  CALL_SCRIPTS: 'call_scripts',
  PROMOTIONS: 'promotions',
  DAILY_PROGRESS: 'daily_progress',
  NUMBERS_DATABASE: 'numbers_database',
  NUMBER_ASSIGNMENTS: 'number_assignments',
  CALL_LOGS: 'call_logs',
  ARCHIVE: 'archive',
  LOGIN_AUDIT: 'login_audit',
  GLOBAL_SETTINGS: 'global_settings',
} as const;

/**
 * Initialize database with indexes and default data
 */
export async function initializeDatabase() {
  console.log('[MongoDB] Initializing database...');
  
  const db = await getMongoDb();

  // Create indexes for performance
  try {
    // Users collection indexes
    const users = db.collection(Collections.USERS);
    await users.createIndex({ username: 1 }, { unique: true });
    await users.createIndex({ email: 1 });
    await users.createIndex({ role: 1 });

    // Numbers database indexes
    const numbersDb = db.collection(Collections.NUMBERS_DATABASE);
    await numbersDb.createIndex({ phoneNumber: 1 });
    await numbersDb.createIndex({ customerType: 1 });
    await numbersDb.createIndex({ airplane: 1 });
    await numbersDb.createIndex({ status: 1 });
    await numbersDb.createIndex({ uploadedAt: -1 });

    // Number assignments indexes
    const assignments = db.collection(Collections.NUMBER_ASSIGNMENTS);
    await assignments.createIndex({ agentId: 1 });
    await assignments.createIndex({ assignedAt: -1 });
    await assignments.createIndex({ status: 1 });

    // Call logs indexes
    const callLogs = db.collection(Collections.CALL_LOGS);
    await callLogs.createIndex({ agentId: 1 });
    await callLogs.createIndex({ callTime: -1 });
    await callLogs.createIndex({ direction: 1 });

    // Archive indexes
    const archive = db.collection(Collections.ARCHIVE);
    await archive.createIndex({ archivedAt: -1 });
    await archive.createIndex({ entityType: 1 });

    // Login audit indexes
    const loginAudit = db.collection(Collections.LOGIN_AUDIT);
    await loginAudit.createIndex({ timestamp: -1 });
    await loginAudit.createIndex({ userId: 1 });

    console.log('[MongoDB] ✅ Indexes created successfully');

    // Create default admin user if no users exist
    const userCount = await users.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Creating default admin user...');
      await users.insertOne({
        id: 'admin-1',
        username: 'admin',
        name: 'Administrator',
        email: 'admin@btmtravel.net',
        password: 'admin123',
        role: 'admin',
        permissions: [],
        createdAt: new Date().toISOString(),
      });
      console.log('[MongoDB] ✅ Default admin user created (username: admin, password: admin123)');
    }

    console.log('[MongoDB] ✅ Database initialized successfully');
  } catch (error) {
    console.error('[MongoDB] Error initializing database:', error);
    throw error;
  }
}

/**
 * Helper function to convert MongoDB _id to id for frontend compatibility
 */
export function convertMongoDoc<T>(doc: any): T {
  if (!doc) return doc;
  
  const { _id, ...rest } = doc;
  return {
    ...rest,
    // Keep the original id if it exists, otherwise use _id
    ...(rest.id ? {} : { id: _id.toString() }),
  } as T;
}

/**
 * Helper function to convert array of MongoDB docs
 */
export function convertMongoDocs<T>(docs: any[]): T[] {
  return docs.map(doc => convertMongoDoc<T>(doc));
}
