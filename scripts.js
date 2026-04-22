// --- LÓGICA DE TRANSFORMACIÓN HERO -> NAVBAR ---
const hero = document.getElementById('main-hero');
const placeholder = document.querySelector('.hero-placeholder');

const syncNavbar = () => {
  const scroll = window.scrollY;
  const triggerHeight = placeholder.offsetHeight;

  if (scroll > triggerHeight) {
    hero.classList.add('compacto');
  } else {
    hero.classList.remove('compacto');
  }
};

window.addEventListener('scroll', syncNavbar, { passive: true });
window.addEventListener('resize', syncNavbar);

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
