import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FieldSync Backend is running');
});

// Auth Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const now = Date.now();

    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email',
      [first_name, last_name, email, password_hash, now, now]
    );

    const user = newUser.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// WatermelonDB Sync Protocol
app.get('/sync', async (req, res) => {
  try {
    const lastPulledAt = parseInt(req.query.last_pulled_at as string) || 0;
    
    // Fetch changes for WorkOrders
    const workOrdersResult = await pool.query(
      'SELECT * FROM work_orders WHERE updated_at > $1', 
      [lastPulledAt]
    );

    // Fetch changes for ChecklistItems
    const checklistItemsResult = await pool.query(
      'SELECT * FROM checklist_items WHERE updated_at > $1',
      [lastPulledAt]
    );

    const changes = {
      work_orders: {
        created: workOrdersResult.rows.filter(r => r.created_at > lastPulledAt),
        updated: workOrdersResult.rows.filter(r => r.created_at <= lastPulledAt && r.updated_at > lastPulledAt),
        deleted: [],
      },
      checklist_items: {
        created: checklistItemsResult.rows.filter(r => r.created_at > lastPulledAt),
        updated: checklistItemsResult.rows.filter(r => r.created_at <= lastPulledAt && r.updated_at > lastPulledAt),
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

    // Process WorkOrders
    if (changes.work_orders) {
      const { created, updated, deleted } = changes.work_orders;
      
      for (const wo of created) {
        await client.query(
          'INSERT INTO work_orders (id, title, subtitle, status, priority, asset_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO UPDATE SET updated_at = $8',
          [wo.id, wo.title, wo.subtitle, wo.status, wo.priority, wo.asset_id, wo.created_at, wo.updated_at]
        );
      }
      
      for (const wo of updated) {
        await client.query(
          'UPDATE work_orders SET title = $1, subtitle = $2, status = $3, priority = $4, asset_id = $5, updated_at = $6 WHERE id = $7',
          [wo.title, wo.subtitle, wo.status, wo.priority, wo.asset_id, wo.updated_at, wo.id]
        );
      }
    }

    // Process ChecklistItems
    if (changes.checklist_items) {
      const { created, updated, deleted } = changes.checklist_items;
      
      for (const item of created) {
        await client.query(
          'INSERT INTO checklist_items (id, work_order_id, title, is_completed, requirements, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO UPDATE SET updated_at = $7',
          [item.id, item.work_order_id, item.title, item.is_completed, item.requirements, item.created_at, item.updated_at]
        );
      }

      for (const item of updated) {
        await client.query(
          'UPDATE checklist_items SET title = $1, is_completed = $2, requirements = $3, updated_at = $4 WHERE id = $5',
          [item.title, item.is_completed, item.requirements, item.updated_at, item.id]
        );
      }
    }

    await client.query('COMMIT');
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Sync push error:', error);
    res.status(500).json({ error: 'Sync push failed' });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
