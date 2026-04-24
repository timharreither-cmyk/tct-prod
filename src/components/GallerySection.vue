<script setup>
import img1 from '../assets/club-images/7f5c81a90d44b5f6b88824457cbdd3a9c30ea09b.jpg'
import img2 from '../assets/club-images/7543246b68ef924572250e46ee747020720ef66f.jpg'
import img3 from '../assets/club-images/27a736696d930a0ebada09fc03f3f6c411e04f51.jpg'

const photos = [
  { src: img1, alt: 'TCT Vereinsleitung', position: 'top' },
  { src: img2, alt: 'TCT Anlage Luftaufnahme', position: 'center' },
  { src: img3, alt: 'TCT Sandplätze', position: 'center' },
]
</script>

<template>
  <section class="gallery">
    <div class="gallery__strip">
      <div v-for="(p, i) in photos" :key="i" class="gallery__item">
        <img :src="p.src" :alt="p.alt" :style="{ objectPosition: p.position }" loading="lazy" />
        <span class="gallery__caption">{{ p.alt }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  background-color: var(--bg-dark);
  overflow: hidden;
}

.gallery__strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5px;
  background-color: var(--border-dark);
  height: 320px;
}

.gallery__item {
  position: relative;
  overflow: hidden;
}

.gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  display: block;
}

.gallery__item:hover img {
  transform: scale(1.05);
}

.gallery__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  background: linear-gradient(transparent, rgba(9, 21, 32, 0.8));
  opacity: 0;
  transition: opacity var(--transition);
}

.gallery__item:hover .gallery__caption {
  opacity: 1;
}

@media (max-width: 700px) {
  .gallery__strip {
    grid-template-columns: 1fr 1fr;
    height: auto;
  }

  .gallery__item {
    height: 200px;
  }

  .gallery__item:last-child {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .gallery__strip {
    grid-template-columns: 1fr;
  }

  .gallery__item:last-child {
    grid-column: span 1;
  }
}
</style>
