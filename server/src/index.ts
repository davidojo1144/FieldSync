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

// WatermelonDB Sync Protocol
app.get('/sync', async (req, res) => {
  try {
    const lastPulledAt = parseInt(req.query.last_pulled_at as string) || 0;
    
    // 1. Fetch created/updated records since lastPulledAt
    // Note: In a real app, you'd use your specific table structure
    const changes = {
      projects: { created: [], updated: [], deleted: [] },
      tasks: { created: [], updated: [], deleted: [] }
    };

    // Example query (simplified)
    // const { rows: projects } = await pool.query('SELECT * FROM projects WHERE updated_at > to_timestamp($1)', [lastPulledAt / 1000]);
    
    res.json({
      changes,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Sync pull error:', error);
    res.status(500).json({ error: 'Sync pull failed' });
  }
});

app.post('/sync', async (req, res) => {
  try {
    const lastPulledAt = parseInt(req.query.last_pulled_at as string) || 0;
    const { changes } = req.body;
    
    // 2. Apply changes to PostgreSQL
    // Iterate through `changes` (projects, tasks) and perform INSERT/UPDATE/DELETE
    console.log('Received changes to push:', JSON.stringify(changes, null, 2));

    res.status(200).send('OK');
  } catch (error) {
    console.error('Sync push error:', error);
    res.status(500).json({ error: 'Sync push failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
