import { MongoClient, Db } from "mongodb";

// Cache client connection across hot reloads and serverless function invocations
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoUri(): string | undefined {
  return process.env.MONGODB_URI;
}

export function getDbName(): string {
  return process.env.MONGODB_DB_NAME || "khamarbari";
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = getMongoUri();
  if (!uri) {
    return null;
  }

  try {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
      }
      return await global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri);
        clientPromise = client.connect();
      }
      return await clientPromise;
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return null;
  }
}

export async function getDatabase(): Promise<Db | null> {
  const client = await getMongoClient();
  if (!client) {
    return null;
  }
  return client.db(getDbName());
}

export async function isMongoConnected(): Promise<{ connected: boolean; dbName: string; error?: string }> {
  try {
    const db = await getDatabase();
    if (!db) {
      return { connected: false, dbName: getDbName(), error: "MONGODB_URI environment variable not configured" };
    }
    // Ping database to confirm live connection
    await db.command({ ping: 1 });
    return { connected: true, dbName: getDbName() };
  } catch (error: any) {
    return {
      connected: false,
      dbName: getDbName(),
      error: error?.message || "Failed to reach MongoDB server",
    };
  }
}
