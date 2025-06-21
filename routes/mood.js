// server/routes/mood.js
const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/mood - Submit mood
router.post('/', auth, async (req, res) => {
  const { mood } = req.body;
  const userId = req.user.id;

  if (!mood) return res.status(400).json({ msg: 'Mood is required' });

  try {
    await pool.query(
      'INSERT INTO mood_entries (user_id, mood) VALUES ($1, $2)',
      [userId, mood]
    );
    res.json({ msg: 'Mood recorded' });
  } catch (err) {
    console.error('❌ Mood save error:', err.message);
    res.status(500).json({ msg: 'Failed to save mood' });
  }
});

// GET /api/mood - Get mood history
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT mood, created_at FROM mood_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Mood fetch error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch mood history' });
  }
});

module.exports = router;
