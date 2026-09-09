# Remindr — Appointment Reminder App (MVP)

A simple appointment reminder app: add an appointment, choose when to be
reminded, and get an SMS before it happens.

## Features (v1)

- Create an appointment (title, date/time, phone number, reminder offset)
- View upcoming appointments
- Mark appointments as completed or cancel them
- Background job checks every minute for due reminders and sends an SMS via Twilio

## Stack

- Frontend: plain HTML/CSS/JS (`public/`)
- Backend: Node.js + Express
- Database: MySQL
- SMS: Twilio
- Scheduling: node-cron

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create the database**
   ```bash
   mysql -u root -p < sql/schema.sql
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Then fill in:
   - `DB_PASSWORD` — your MySQL root password
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` — from your
     [Twilio console](https://console.twilio.com). A trial account works for testing,
     but can only send to verified numbers until you upgrade.

4. **Run the server**
   ```bash
   npm start
   ```
   Visit `http://localhost:3000`.

## How the reminder actually fires

Every minute, a cron job (`services/reminderCron.js`) queries for appointments
where `NOW() >= appointment_time - reminder_offset_minutes`. Each match gets an
SMS via Twilio and its status flips from `pending` to `reminded`.

## API

| Method | Route               | Description                     |
|--------|---------------------|----------------------------------|
| POST   | `/appointments`     | Create an appointment            |
| GET    | `/appointments`     | List non-cancelled appointments  |
| PATCH  | `/appointments/:id` | Update status (completed/cancelled) |
| DELETE | `/appointments/:id` | Delete an appointment            |

## Next steps (not in this MVP)

- User accounts / auth (right now all appointments are global)
- Editing an appointment after creation
- Medication-style recurring reminders + "Taken/Missed" history
- Timezone handling beyond server-local time
- Retry logic for failed SMS sends