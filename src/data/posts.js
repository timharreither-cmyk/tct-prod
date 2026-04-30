import { ref } from 'vue'

// ── Reactive admin-posts store ────────────────────────────────────────────────
export const adminPosts = ref([])

export async function loadAdminPosts() {
  try {
    const res = await fetch('/api/posts')
    if (res.ok) adminPosts.value = await res.json()
  } catch {
    adminPosts.value = []
  }
}

export async function savePost(data) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  const post = await res.json()
  adminPosts.value = [post, ...adminPosts.value]
  return post
}

export async function updatePost(id, data) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  const updated = await res.json()
  adminPosts.value = adminPosts.value.map(p => (p.id === id ? updated : p))
  return updated
}

export async function deletePost(id) {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  adminPosts.value = adminPosts.value.filter(p => p.id !== id)
}

export async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload fehlgeschlagen')
  const { url } = await res.json()
  return url
}

// ── Hardcoded posts ───────────────────────────────────────────────────────────
export const posts = [
  {
    id: 'season-opening-2026',
    slug: 'season-opening-2026',
    title: 'Event "Season Opening" 2026',
    date: '2026-04-01',
    category: 'Events',
    excerpt: 'Am Samstag, den 25. April 2026 laden wir zum traditionellen Season Opening ein – mit Generationen-Doppel, Catering und guter Stimmung ab 10:00 Uhr.',
    content: `
# Event "Season Opening" 2026

Am **Samstag, den 25. April 2026** lädt der Tennisclub Tulln zum großen Season Opening ein!

## Programm

- **10:00 Uhr** – Einlass und Warm-up
- **10:30 Uhr** – Generationen-Doppel (Jung gegen Alt)
- **12:00 Uhr** – Mittagspause mit Catering durch Clubmitglieder
- **14:00 Uhr** – Mixed-Doppel-Turnier
- **18:00 Uhr** – Siegerehrung und gemütlicher Ausklang

## Was Sie erwartet

Das Season Opening ist unser Saisonauftakt – ein Tag voller Tennis, Gemeinschaft und guter Laune. Alle Mitglieder, Familien und Interessierte sind herzlich willkommen.

Das Catering wird von unseren engagierten Clubmitgliedern übernommen. Wir freuen uns auf einen unvergesslichen Start in die Freiluftsaison 2026!

**Anmeldung** direkt über die Clubverwaltung oder per Kontaktformular.
    `,
    image: null,
    featured: true,
  },
  {
    id: 'gastro-change-timeline',
    slug: 'gastro-change-timeline',
    title: 'Timeline für den "Gastro-Change"',
    date: '2026-04-20',
    category: 'Clublokal',
    excerpt: 'Die Familie Lin ist bis inklusive Dienstag, 21. April 2026 wie gewohnt für euch da. Ab 1. Mai übernimmt Ellwood Entlicher mit einem neuen American Sports Bar Konzept.',
    content: `
# Timeline für den „Gastro-Change"

Wir möchten euch transparent über die Übergabe in unserem Clublokal informieren.

## Übergangsphase

**Bis einschließlich Dienstag, 21. April 2026** wird die Familie Lin wie gewohnt für euch da sein. Wir bedanken uns herzlich bei der Familie Lin für ihren jahrelangen Einsatz und die tolle Bewirtschaftung unseres Clublokals!

## Neuer Betreiber ab 1. Mai 2026

Ab **1. Mai 2026** übernimmt **Ellwood Entlicher** das Clublokal mit einem frischen **American Sports Bar** Konzept. Erwartet euch:

- Amerikanische Küche & Snacks
- Craft Bier & Cocktails
- Sportübertragungen auf großen Bildschirmen
- Gemütliche Lounge-Atmosphäre

## Zwischenzeit

In der Zeit vom 22. April bis 30. April wird das Lokal für den Umbau geschlossen. Wir bitten um Verständnis.

Wir freuen uns auf das neue Kapitel und sind gespannt auf die neue Atmosphäre!
    `,
    image: null,
    featured: false,
  },
  {
    id: 'neuer-schwung-clublokal',
    slug: 'neuer-schwung-clublokal',
    title: 'Neuer Schwung für unser Clublokal: Ellwood Entlicher übernimmt',
    date: '2026-04-11',
    category: 'Clublokal',
    excerpt: 'Wir freuen uns, einen neuen Betreiber für unser Clublokal bekannt zu geben. Ellwood Entlicher bringt frischen Wind mit einem modernen American Sports Bar Konzept.',
    content: `
# Neuer Schwung für unser Clublokal

Der Tennisclub Tulln freut sich, einen neuen Betreiber für sein Clublokal bekannt zu geben!

## Ellwood Entlicher

**Ellwood Entlicher** ist ein erfahrener Gastronom mit Leidenschaft für Sport und Gemeinschaft. Mit seinem **American Sports Bar** Konzept möchte er das Clublokal zu einem lebendigen Treffpunkt für Mitglieder und Gäste machen.

## Das neue Konzept

- Hochwertige amerikanische Küche
- Saisonale Getränkekarte
- Live-Sport auf großen Screens
- Events und Themenabende
- Familien- und kindergerechte Atmosphäre

Wir sind überzeugt, dass Ellwood Entlicher dem Clublokal neues Leben einhauchen wird und freuen uns auf eine lange, erfolgreiche Zusammenarbeit!

**Eröffnung: 1. Mai 2026**
    `,
    image: null,
    featured: false,
  },
  {
    id: 'freiluft-saison-begonnen',
    slug: 'freiluft-saison-begonnen',
    title: 'Die Freiluft-Saison hat begonnen!',
    date: '2026-03-25',
    category: 'Anlage',
    excerpt: 'Die Außenplätze sind wieder geöffnet! Nach der erfolgreichen Frühjahrssanierung stehen euch unsere Sandplätze wieder in bestem Zustand zur Verfügung.',
    content: `
# Die Freiluft-Saison 2026 hat begonnen!

Es ist wieder soweit – unsere **Sandplätze im Freien** sind ab sofort geöffnet!

## Frühjahrssanierung abgeschlossen

Nach intensiver Frühjahrssanierung präsentieren sich alle Außenplätze in hervorragendem Zustand:

- Plätze 1–2: Vollständig saniert und neu bespielt
- Plätze 7–10: Erneuerte Sand-Oberfläche
- Netzanlagen: Alle neu gespannt
- Linien: Frisch eingezeichnet

## Reservierung

Plätze können wie gewohnt über unser Online-Buchungssystem reserviert werden. Wir empfehlen frühzeitige Buchung, besonders am Wochenende.

**Viel Spaß auf den Plätzen und einen guten Start in die Saison 2026!**
    `,
    image: null,
    featured: false,
  },
  {
    id: 'jugend-landesmeister-2026',
    slug: 'jugend-landesmeister-2026',
    title: 'Zwei TCT-Talente werden Landesmeister!',
    date: '2026-03-01',
    category: 'Jugend',
    excerpt: 'Laurin Laber und Lars Schauerhuber haben bei den Hallen-Landesmeisterschaften ihre Altersklassen gewonnen. Herzlichen Glückwunsch zu dieser großartigen Leistung!',
    content: `
# Zwei TCT-Talente werden Landesmeister!

Wir sind unglaublich stolz auf unsere jungen Talente!

## Laurin Laber

**Laurin Laber** hat bei den Hallen-Landesmeisterschaften in seiner Altersklasse den Titel geholt. Mit konstantem Spiel und starker Nervenstärke setzte er sich souverän durch.

## Lars Schauerhuber

**Lars Schauerhuber** bewies ebenfalls sein außergewöhnliches Talent und sicherte sich den Landesmeistertitel in seiner Altersklasse mit eindrucksvollen Leistungen.

## Dank an die Tennisschule Wolf

Diese Erfolge wären ohne die hervorragende Arbeit der **Tennisschule Christian Wolf** nicht möglich. Herzlichen Dank für die professionelle Ausbildung unserer Nachwuchsspieler!

**Der TCT gratuliert herzlichst – weiter so!**
    `,
    image: null,
    featured: false,
  },
  {
    id: 'fruehjahrsanierung-2026',
    slug: 'fruehjahrsanierung-2026',
    title: 'Frühjahrssanierung 2026',
    date: '2026-03-20',
    category: 'Anlage',
    excerpt: 'Die jährliche Frühjahrssanierung unserer Anlage ist im Gange. Wir arbeiten intensiv daran, alle Plätze für die neue Saison optimal vorzubereiten.',
    content: `
# Frühjahrssanierung 2026

Jedes Jahr investiert der Tennisclub Tulln in die Qualität seiner Anlage – so auch 2026.

## Sanierungsmaßnahmen

Folgende Arbeiten werden durchgeführt:

- **Plätze 1–2:** Vollständige Sanierung der Spielfläche
- **Plätze 7–10:** Erneuerung der Sand-Oberfläche und Drainage
- **Tennishalle:** Wartung der Hallenbeleuchtung und Heizanlage
- **Clubhaus:** Renovierung der Umkleidekabinen

## Zeitplan

Die Sanierung läuft vom 15. März bis 24. März 2026. Die Außenplätze werden ab **25. März 2026** wieder für Mitglieder geöffnet sein.

## Qualität hat Vorrang

Wir danken allen Mitgliedern für ihr Verständnis während der Schließzeit. Unser Ziel ist es, euch stets die bestmögliche Spielfläche zu bieten.
    `,
    image: null,
    featured: false,
  },
]

// ── Query helpers (reactive – reads adminPosts.value so computed() tracks it) ─
export function getAllPosts() {
  return [...adminPosts.value, ...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug) {
  return getAllPosts().find(p => p.slug === slug) || null
}

export function getFeaturedPost() {
  return getAllPosts().find(p => p.featured) || getAllPosts()[0]
}

export function getRecentPosts(limit = 3) {
  return getAllPosts().slice(0, limit)
}
