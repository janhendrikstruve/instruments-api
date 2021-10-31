import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import { connectToDB, getItemsCollection } from './utils/db';

// instrument = {
//   name: 'bla',
//   inventor: 'bla',
//   inventionYear: 1222,
//   bands: [
//     'band1', 'band2'
//   ],
//   rating: 5,
//   ddr: false,
//   bootcamp: true,
// }

const app = express();
app.use(cookieParser());
app.use(express.json());
const port = 3000;

app.post('/instruments', async (req, _res) => {
  const toCreate = req.body;
  const DB = await getItemsCollection();
  console.log(toCreate);
  if (Array.isArray(toCreate)) {
    console.log('Array of objects!');
    DB.insertMany(toCreate);
  } else {
    console.log('One object!');
    DB.insertOne(toCreate);
  }
});

app.delete('/instruments/:name', async (req, _res) => {
  const toDelete = req.params.name.split(',');
  const DB = await getItemsCollection();
  console.log(toDelete);
  if (toDelete.length > 1) {
    console.log('mehrere deletes');
    await toDelete.forEach((instrument) => DB.deleteOne({ name: instrument }));
  } else {
    console.log('ein delete');
    await DB.deleteOne({ name: toDelete[0] });
  }
});

app.get('/instruments', async (_req, res) => {
  const query = _req.query;
  const isEmptyArray =
    query &&
    Object.keys(query).length === 0 &&
    Object.getPrototypeOf(query) === Object.prototype;

  if (isEmptyArray) {
    // get all elements
    const allInstruments = await getItemsCollection().find().toArray();
    res.send(allInstruments);
  } else {
    const { name, rating, sound } = query;

    const filters: {
      name?: string;
      sounds?: object;
      rating?: object;
    } = {};

    if (name) {
      filters.name = String(name);
    }
    if (sound) {
      filters.sounds = { $in: [sound] };
    }
    if (rating) {
      filters.rating = { $gte: Number(rating) };
    }

    console.log(filters);
    const instruments = await getItemsCollection().find(filters).toArray();
    res.send(instruments);
  }
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

connectToDB(`${process.env.MONGODB_URI}`).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
