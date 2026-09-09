const API_BASE = '/appointments';

const form = document.getElementById('appointment-form');
const formMessage = document.getElementById('form-message');
const listEl = document.getElementById('appointments-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';
  formMessage.className = 'form-message';

  const payload = {
    title: form.title.value.trim(),
    appointment_time: form.appointment_time.value,
    phone_number: form.phone_number.value.trim(),
    reminder_offset_minutes: Number(form.reminder_offset_minutes.value)
  };

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Could not save appointment.');
    }

    form.reset();
    formMessage.textContent = 'Appointment saved.';
    formMessage.classList.add('success');
    loadAppointments();
  } catch (err) {
    formMessage.textContent = err.message;
    formMessage.classList.add('error');
  }
});

async function loadAppointments() {
  try {
    const res = await fetch(API_BASE);
    const appointments = await res.json();
    renderAppointments(appointments);
  } catch (err) {
    listEl.innerHTML = `<p class="empty-state">Couldn't load appointments right now.</p>`;
  }
}

function renderAppointments(appointments) {
  if (!appointments.length) {
    listEl.innerHTML = `<p class="empty-state">No appointments yet. Add your first one.</p>`;
    return;
  }

  listEl.innerHTML = appointments.map(appt => `
    <div class="appointment-card" data-id="${appt.id}">
      <div class="appointment-info">
        <h3>${escapeHtml(appt.title)}</h3>
        <div class="when">${formatDateTime(appt.appointment_time)}</div>
      </div>
      <span class="status-badge status-${appt.status}">${appt.status}</span>
      <div class="appointment-actions">
        ${appt.status !== 'completed' ? `<button data-action="complete" data-id="${appt.id}">Mark done</button>` : ''}
        <button data-action="cancel" data-id="${appt.id}">Cancel</button>
      </div>
    </div>
  `).join('');
}

listEl.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  try {
    if (action === 'complete') {
      await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
    } else if (action === 'cancel') {
      await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
    }
    loadAppointments();
  } catch (err) {
    console.error('Action failed', err);
  }
});

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadAppointments();