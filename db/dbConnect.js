import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  // If a connection already exists, return it.
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  // Await the promise and store the connection.
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
