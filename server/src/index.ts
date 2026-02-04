import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FieldSync Backend is running');
});

// Sync endpoint placeholder
app.post('/sync', async (req, res) => {
  const { changes, lastPulledAt } = req.body;
  // TODO: Implement WatermelonDB sync protocol
  console.log('Sync request:', { lastPulledAt, changes });
  res.json({ changes: {}, timestamp: Date.now() });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
