const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// GET /api/admin/reminder-settings
router.get('/reminder-settings', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM reminder_settings ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        mood_popup_1: '',
        mood_popup_2: '',
        water_interval_minutes: '',
        posture_interval_minutes: '',
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching reminder settings:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/reminder-settings
router.post('/reminder-settings', authenticateToken, async (req, res) => {
  let { mood_popup_1, mood_popup_2, water_interval_minutes, posture_interval_minutes } = req.body;

  try {
    // Convert empty string to null for TIME columns
    mood_popup_1 = mood_popup_1?.trim() === '' ? null : mood_popup_1;
    mood_popup_2 = mood_popup_2?.trim() === '' ? null : mood_popup_2;

    // Convert non-numeric or empty strings to null for interval columns
    water_interval_minutes = isNaN(parseInt(water_interval_minutes)) ? null : parseInt(water_interval_minutes);
    posture_interval_minutes = isNaN(parseInt(posture_interval_minutes)) ? null : parseInt(posture_interval_minutes);

    await db.query(
      `INSERT INTO reminder_settings (mood_popup_1, mood_popup_2, water_interval_minutes, posture_interval_minutes)
       VALUES ($1, $2, $3, $4)`,
      [mood_popup_1, mood_popup_2, water_interval_minutes, posture_interval_minutes]
    );

    res.json({ message: 'Settings saved successfully!' });
  } catch (err) {
    console.error('❌ Error saving reminder settings:', err.message);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

module.exports = router;
