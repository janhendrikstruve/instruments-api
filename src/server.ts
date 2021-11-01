import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import { connectToDB, getItemsCollection, checkKeys } from './utils/db';

// instrument = {
//   name: 'bla',
//   inventor: 'bla',
//   year: 1222,
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
  const instruments = req.body;
  const DB = await getItemsCollection();
  const keysToCheck = [
    'name',
    'inventor',
    'year',
    'bands',
    'rating',
    'ddr',
    'bootcamp',
  ];
  instruments.forEach((instrument: object) => {
    if (checkKeys(instrument, keysToCheck)) {
      DB.insertOne(instrument);
    }
  });
});

app.delete('/instruments/:name', async (req, _res) => {
  const toDelete = req.params.name.split(',');
  const DB = await getItemsCollection();
  await toDelete.forEach((instrument) =>
    console.log(DB.deleteOne({ name: instrument }))
  );
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
