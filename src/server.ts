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
