import { ref } from 'vue'

// ── Reactive admin-events store ───────────────────────────────────────────────
export const adminEvents = ref([])

export async function loadAdminEvents() {
  try {
    const res = await fetch('/api/events')
    if (res.ok) adminEvents.value = await res.json()
  } catch {
    adminEvents.value = []
  }
}

export async function saveEvent(data) {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  const event = await res.json()
  adminEvents.value = [event, ...adminEvents.value]
  return event
}

export async function updateEvent(id, data) {
  const res = await fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  const updated = await res.json()
  adminEvents.value = adminEvents.value.map(e => (e.id === id ? updated : e))
  return updated
}

export async function deleteEvent(id) {
  await fetch(`/api/events/${id}`, { method: 'DELETE' })
  adminEvents.value = adminEvents.value.filter(e => e.id !== id)
}

// ── Hardcoded fallback events (shown when no admin events exist) ──────────────
export const fallbackEvents = [
  {
    id: 'fallback-1',
    date: '2026-04-25',
    time: '10:00 Uhr',
    title: 'Season Opening 2026',
    description: 'Der traditionelle Saisonauftakt mit Generationen-Doppel, Catering und gemütlichem Beisammensein für alle Mitglieder und Interessierte.',
    location: 'TC Tulln Anlage',
    tag: 'Event',
  },
  {
    id: 'fallback-2',
    date: '2026-05-01',
    time: '18:00 Uhr',
    title: 'Eröffnung: Neues Clublokal',
    description: 'Grand Opening des neuen Clublokals unter Betreiber Ellwood Entlicher mit amerikanischem Sports Bar Konzept.',
    location: 'Clubhaus TC Tulln',
    tag: 'Clublokal',
  },
  {
    id: 'fallback-3',
    date: '2026-06-15',
    time: 'TBA',
    title: 'Vereinsmeisterschaft Sommer',
    description: 'Die jährliche Vereinsmeisterschaft aller Klassen – von Jugend bis Senioren. Anmeldung über die Clubverwaltung.',
    location: 'TC Tulln Anlage',
    tag: 'Turnier',
  },
]

const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

export function formatEventDate(iso) {
  const d = new Date(iso)
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: MONTHS_DE[d.getMonth()],
    year: String(d.getFullYear()),
  }
}

export function getAllEvents() {
  const source = adminEvents.value.length > 0 ? adminEvents.value : fallbackEvents
  return [...source].sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function getUpcomingEvents(limit = 10) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return getAllEvents().filter(e => new Date(e.date) >= now).slice(0, limit)
}
