<script setup>
import imgTeam1 from '../assets/club-images/aa064eebff59ade73e4709f3913d5426e34f58d3.jpg'
import imgTeam2 from '../assets/club-images/4985a81dab06543f9c3a2569b5a4f20a144f425a.jpg'

const teams = [
  { id: 1, name: 'Damen 1', league: 'NÖ Landesliga', description: 'Unser erstes Damenteam kämpft in der Niederösterreichischen Landesliga um Punkte und Aufstieg.' },
  { id: 2, name: 'Herren 1', league: 'NÖ Landesliga', description: 'Flaggschiff des Vereins – das erste Herrenteam spielt auf höchstem regionalen Niveau.' },
  { id: 3, name: 'Herren 2', league: 'NÖ Landesliga', description: 'Das zweite Herrenteam mit starker Besetzung und ambitionierten Saisonzielen.' },
  { id: 4, name: 'Herren 3', league: 'Kreisliga', description: 'Solide Mannschaft mit erfahrenen Spielern und gutem Zusammenhalt.' },
  { id: 5, name: 'Herren 4', league: 'Kreisliga', description: 'Unsere vierte Herrenmannschaft – Spaß am Spiel und Teamgeist stehen im Vordergrund.' },
]
</script>

<template>
  <section class="section section--white" id="teams">
    <div class="container">
      <div class="teams__header">
        <div>
          <span class="section__label">Mannschaften</span>
          <div class="divider"></div>
          <h2 class="section__title">Unsere <em>Teams</em></h2>
        </div>
        <p class="section__body">
          Fünf Mannschaften repräsentieren den TC Tulln im Verbandsspielbetrieb –
          vom Bezirk bis in die Landesliga.
        </p>
      </div>

      <div class="teams__photos">
        <div class="teams__photo">
          <img :src="imgTeam1" alt="TC Tulln Mannschaft" loading="lazy" />
        </div>
        <div class="teams__photo">
          <img :src="imgTeam2" alt="TC Tulln Team" loading="lazy" />
        </div>
      </div>

      <div class="teams__grid">
        <article v-for="team in teams" :key="team.id" class="team-card">
          <div class="team-card__badge">{{ String(team.id).padStart(2, '0') }}</div>
          <div class="team-card__body">
            <div class="team-card__league">{{ team.league }}</div>
            <h3 class="team-card__name">{{ team.name }}</h3>
            <p class="team-card__desc">{{ team.description }}</p>
          </div>
          <div class="team-card__foot">
            <a href="https://www.tc-tulln.at" target="_blank" rel="noopener" class="team-card__link">
              Spieler & Ergebnisse
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.teams__header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: end;
}

.teams__header .section__title em {
  font-style: italic;
  color: var(--blue);
}

.teams__photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5px;
  margin-bottom: 1.5px;
  background-color: var(--border);
  height: 280px;
}

.teams__photo {
  overflow: hidden;
}

.teams__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.6s ease;
}

.teams__photo:hover img {
  transform: scale(1.04);
}

.teams__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5px;
  background-color: var(--border);
}

.team-card {
  background-color: var(--white);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: background-color var(--transition);
  min-height: 260px;
}

.team-card:hover {
  background-color: var(--bg);
}

.team-card__badge {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--border);
  line-height: 1;
}

.team-card__league {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--blue);
}

.team-card__name {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--black);
}

.team-card__desc {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.6;
  flex-grow: 1;
}

.team-card__foot {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  margin-top: auto;
}

.team-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--blue);
  text-decoration: none;
  transition: gap var(--transition);
}

.team-card__link:hover {
  gap: 0.7rem;
}

@media (max-width: 1100px) {
  .teams__grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 700px) {
  .teams__grid { grid-template-columns: 1fr 1fr; }
  .teams__header { grid-template-columns: 1fr; }
  .teams__photos { grid-template-columns: 1fr; height: 200px; }
}

@media (max-width: 480px) {
  .teams__grid { grid-template-columns: 1fr; }
  .teams__photos { height: 160px; }
}
</style>
