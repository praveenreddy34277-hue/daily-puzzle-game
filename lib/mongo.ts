import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  // eslint-disable-next-line no-varimport mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var __mongooseCache:
    | { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> }
    | undefined;
}

const cached = global.__mongooseCache || (global.__mongooseCache = {});

export async function connectMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
  var __mongooseCache: { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> } | undefined;
}

const cached = global.__mongooseCache || (global.__mongooseCache = {});

export async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
