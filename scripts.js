// --- LÓGICA DE TRANSFORMACIÓN HERO -> NAVBAR ---
const hero = document.getElementById('main-hero');
const heroHeight = hero.offsetHeight;

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    hero.classList.add('compacto');
  } else {
    hero.classList.remove('compacto');
  }
});

// --- LÓGICA DE GALERÍA (LIGHTBOX) ---
const galeria = document.getElementById('galeria-encuentros');
const visor = document.getElementById('visualizador');
const imgFull = document.getElementById('img-full');

if (galeria && visor && imgFull) {
  galeria.addEventListener('click', (e) => {
    const item = e.target.closest('.foto-item');
    if (!item) return;
    const img = item.querySelector('img');
    imgFull.src = img.src;
    imgFull.alt = img.alt;
    visor.classList.add('activo');
    document.body.style.overflow = 'hidden';
  });

  const cerrarVisor = () => {
    visor.classList.remove('activo');
    document.body.style.overflow = 'auto';
  };

  visor.addEventListener('click', cerrarVisor);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarVisor();
  });
}

// --- LÓGICA DE SLIDER DE RESEÑAS ---
const track = document.getElementById('resenas-track');
const dotsContainer = document.getElementById('dots-container');

if (track && dotsContainer) {
  const cards = document.querySelectorAll('.resena-card');
  let currentIndex = 0;
  const slideDuration = 5000;
  let lastTime = Date.now();
  let slideProgress = 0;
  let isPaused = false;

  // Pausar al hacer hover
  track.addEventListener('mouseenter', () => isPaused = true);
  track.addEventListener('mouseleave', () => isPaused = false);

  // Crear puntos
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('activo');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  const updateSlider = () => {
    const gap = 32;
    const cardWidth = cards[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('activo', i === currentIndex);
      if (i !== currentIndex) dot.style.setProperty('--p', '0');
    });
  };

  const goToSlide = (index) => {
    currentIndex = index;
    slideProgress = 0;
    updateSlider();
  };

  const animate = () => {
    const now = Date.now();
    const delta = now - lastTime;
    lastTime = now;

    if (!isPaused) {
      slideProgress += (delta / slideDuration) * 100;
      
      if (slideProgress >= 100) {
        currentIndex = (currentIndex + 1) % cards.length;
        goToSlide(currentIndex);
      }

      // Actualizar el progreso circular del punto activo
      if (dots[currentIndex]) {
        dots[currentIndex].style.setProperty('--p', slideProgress);
      }
    }

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
  window.addEventListener('resize', updateSlider);
}
