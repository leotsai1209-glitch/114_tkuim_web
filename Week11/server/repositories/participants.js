// server/repositories/participants.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

function collection() {
  return getDB().collection('participants');
}

export async function createParticipant(data) {
  const result = await collection().insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result.insertedId;
}

export async function listParticipants() {
  const items = await collection()
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return items;
}