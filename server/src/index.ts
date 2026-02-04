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
    
    // Fetch changes for Projects
    const projectsResult = await pool.query(
      'SELECT * FROM projects WHERE updated_at > $1', 
      [lastPulledAt]
    );

    // Fetch changes for Tasks
    const tasksResult = await pool.query(
      'SELECT * FROM tasks WHERE updated_at > $1',
      [lastPulledAt]
    );

    const changes = {
      projects: {
        created: projectsResult.rows.filter(r => r.created_at > lastPulledAt),
        updated: projectsResult.rows.filter(r => r.created_at <= lastPulledAt && r.updated_at > lastPulledAt),
        deleted: [], // TODO: Implement soft deletes to track deletions
      },
      tasks: {
        created: tasksResult.rows.filter(r => r.created_at > lastPulledAt),
        updated: tasksResult.rows.filter(r => r.created_at <= lastPulledAt && r.updated_at > lastPulledAt),
        deleted: [],
      }
    };
    
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
  const client = await pool.connect();
  try {
    const { changes } = req.body;
    await client.query('BEGIN');

    // Process Projects
    if (changes.projects) {
      const { created, updated, deleted } = changes.projects;
      
      for (const p of created) {
        await client.query(
          'INSERT INTO projects (id, name, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET updated_at = $5',
          [p.id, p.name, p.description, p.created_at, p.updated_at]
        );
      }
      
      for (const p of updated) {
        await client.query(
          'UPDATE projects SET name = $1, description = $2, updated_at = $3 WHERE id = $4',
          [p.name, p.description, p.updated_at, p.id]
        );
      }
    }

    // Process Tasks
    if (changes.tasks) {
      const { created, updated, deleted } = changes.tasks;
      
      for (const t of created) {
        await client.query(
          'INSERT INTO tasks (id, project_id, title, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET updated_at = $6',
          [t.id, t.project_id, t.title, t.status, t.created_at, t.updated_at]
        );
      }

      for (const t of updated) {
        await client.query(
          'UPDATE tasks SET title = $1, status = $2, updated_at = $3 WHERE id = $4',
          [t.title, t.status, t.updated_at, t.id]
        );
      }
    }

    await client.query('COMMIT');
    res.status(200).send('OK');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Sync push error:', error);
    res.status(500).json({ error: 'Sync push failed' });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
