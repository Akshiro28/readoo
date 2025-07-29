import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongo } from './config/mongo.js';
import { initializeFirebase } from './config/firebase.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

await initializeFirebase();
await connectToMongo();

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

