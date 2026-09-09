const express = require('express');
const router = express.Router();
const appointmentModel = require('../models/appointment');

// POST /appointments — create a new appointment
router.post('/', async (req, res) => {
  try {
    const { title, appointment_time, phone_number, reminder_offset_minutes } = req.body;

    if (!title || !appointment_time || !phone_number) {
      return res.status(400).json({
        error: 'title, appointment_time, and phone_number are required.'
      });
    }

    const id = await appointmentModel.create({
      title,
      appointment_time,
      phone_number,
      reminder_offset_minutes: reminder_offset_minutes || 1440 // default: 1 day before
    });

    const created = await appointmentModel.getById(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create appointment.' });
  }
});

// GET /appointments — list all upcoming (non-cancelled) appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await appointmentModel.getAll();
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// PATCH /appointments/:id — update status (e.g. mark completed/cancelled)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reminded', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await appointmentModel.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Appointment not found.' });

    const appointment = await appointmentModel.getById(req.params.id);
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment.' });
  }
});

// DELETE /appointments/:id — remove an appointment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await appointmentModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Appointment not found.' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete appointment.' });
  }
});

module.exports = router;