import mongoose from "mongoose";

// Database connection utility - returns null if MONGODB_URI is not configured
function getMongoURI(): string | null {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn("MONGODB_URI environment variable is not defined. Database features will be disabled.");
    return null;
  }
  
  // Validate the URI format
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.warn(
      `Invalid MONGODB_URI format. Expected URI to start with "mongodb://" or "mongodb+srv://".`
    );
    return null;
  }
  
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose | null> {
  const MONGODB_URI = getMongoURI();
  
  // If no valid URI, return null to indicate database is unavailable
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB:", e);
    return null;
  }

  return cached.conn;
}

export default dbConnect;
