import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Test Database Connection Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ status: 'Connected to MySQL Database!', solution: rows[0].solution });
  } catch (error) {
    res.status(500).json({ error: 'MySQL Connection Error', details: error.message });
  }
});

// 2. User Registration API
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, messName, messType, capacity, location } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, mess_name, mess_type, capacity, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, messName, messType || 'Hostel Mess', capacity || 300, location]
    );

    res.json({
      success: true,
      user: {
        id: result.insertId,
        name,
        email,
        messName,
        messType,
        capacity,
        location,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// 3. User Login API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = users[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        messName: user.mess_name,
        messType: user.mess_type,
        capacity: user.capacity,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// 4. Get Training Meal Logs API
app.get('/api/logs/:userId', async (req, res) => {
  try {
    const [sessions] = await pool.query(
      `SELECT s.id AS session_id, s.session_date, s.meal_type, s.headcount,
              d.id AS dish_id, d.dish_name, d.quantity_cooked, d.quantity_remaining, d.unit
       FROM meal_training_sessions s
       LEFT JOIN dish_training_records d ON s.id = d.session_id
       WHERE s.user_id = ?
       ORDER BY s.session_date DESC`,
      [req.params.userId]
    );

    // Group dishes by meal session
    const logsMap = {};
    sessions.forEach((row) => {
      if (!logsMap[row.session_id]) {
        logsMap[row.session_id] = {
          id: `log_${row.session_id}`,
          date: row.session_date,
          mealType: row.meal_type,
          headcount: row.headcount,
          dishes: [],
        };
      }
      if (row.dish_id) {
        logsMap[row.session_id].dishes.push({
          id: `dish_${row.dish_id}`,
          dishName: row.dish_name,
          quantityCooked: parseFloat(row.quantity_cooked),
          quantityRemaining: parseFloat(row.quantity_remaining),
          unit: row.unit,
        });
      }
    });

    res.json(Object.values(logsMap));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs', details: error.message });
  }
});

// 5. Add New Training Log API
app.post('/api/logs', async (req, res) => {
  const { userId, date, mealType, headcount, dishes } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [sessionResult] = await connection.query(
      `INSERT INTO meal_training_sessions (user_id, session_date, meal_type, headcount) VALUES (?, ?, ?, ?)`,
      [userId, date, mealType, headcount]
    );

    const sessionId = sessionResult.insertId;

    for (const dish of dishes) {
      await connection.query(
        `INSERT INTO dish_training_records (session_id, dish_name, quantity_cooked, quantity_remaining, unit)
         VALUES (?, ?, ?, ?, ?)`,
        [sessionId, dish.dishName, dish.quantityCooked, dish.quantityRemaining, dish.unit]
      );
    }

    await connection.commit();
    res.json({ success: true, sessionId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Failed to save log', details: error.message });
  } finally {
    connection.release();
  }
});

// Start Express API Server
app.listen(PORT, () => {
  console.log(`FoodSense MySQL Backend Server running on http://localhost:${PORT}`);
});
