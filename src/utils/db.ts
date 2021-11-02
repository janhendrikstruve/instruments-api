import { MongoClient } from 'mongodb';

let client: MongoClient;

export async function connectToDB(url: string) {
  client = new MongoClient(url);
  await client.connect();
}

export function getItemsCollection() {
  return client.db('instruments-api').collection('instruments');
}

export function checkKeys(object: object, keys: string[]) {
  let keyAvaileble = true;
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(object, key) === false) {
      keyAvaileble = false;
    }
  });
  return keyAvaileble;
}
