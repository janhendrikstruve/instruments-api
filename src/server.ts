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
  const allInstruments = await getItemsCollection().find().toArray();
  res.send(allInstruments);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

connectToDB(`${process.env.MONGODB_URI}`).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
