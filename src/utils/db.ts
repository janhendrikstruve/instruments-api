import { MongoClient } from 'mongodb';

let client: MongoClient;

export async function connectToDB(url: string) {
  client = new MongoClient(url);
  await client.connect();
}

export function getItemsCollection() {
  return client.db('instruments-api').collection('instruments');
}
