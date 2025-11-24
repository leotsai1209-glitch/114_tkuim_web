import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGO_DBNAME);
    console.log('[DB] Connected to MongoDB');
  }
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error('Database not connected! Please call connectDB() first.');
  }
  return db;
}