const cron = require('node-cron');
const appointmentModel = require('../models/appointment');
const { sendReminderSms } = require('./smsService');

function startReminderJob() {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const due = await appointmentModel.findDueForReminder();

      for (const appointment of due) {
        try {
          await sendReminderSms(appointment);
          await appointmentModel.updateStatus(appointment.id, 'reminded');
          console.log(`Reminder sent for appointment #${appointment.id}: "${appointment.title}"`);
        } catch (err) {
          console.error(`Failed to send reminder for appointment #${appointment.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error('Reminder job failed:', err.message);
    }
  });

  console.log('Reminder cron job started (checking every minute).');
}

module.exports = { startReminderJob };