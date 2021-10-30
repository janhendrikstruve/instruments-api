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
  const { name, sound, rating } = _req.query;

  if (!name && !sound && !rating) {
    // get all elements
    const allInstruments = await getItemsCollection().find().toArray();
    res.send(allInstruments);
  } else {
    res.send('Queried Objects');
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
