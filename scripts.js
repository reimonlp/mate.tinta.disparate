// --- LÓGICA DE TRANSFORMACIÓN HERO -> NAVBAR ---
const hero = document.getElementById('main-hero');
const placeholder = document.querySelector('.hero-placeholder');

const syncNavbar = () => {
  if (!hero || !placeholder) return;
  
  const scroll = window.scrollY;
  // Usamos el alto real del placeholder como gatillo dinámico
  const triggerHeight = placeholder.offsetHeight;

  if (scroll > triggerHeight) {
    hero.classList.add('compacto');
  } else {
    hero.classList.remove('compacto');
  }
};

// Sincronización en scroll y redimensión
window.addEventListener('scroll', syncNavbar, { passive: true });
window.addEventListener('resize', syncNavbar);
syncNavbar(); // Ejecución inicial

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

  visor.addEventListener('click', (e) => {
    if (e.target === visor || e.target.classList.contains('cerrar')) {
      cerrarVisor();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarVisor();
  });
}

// --- CIERRE DE MENÚ AL NAVEGAR (MÓVIL) ---
const menuCheckbox = document.getElementById('menu-cb');
const navLinks = document.querySelectorAll('.nav-list a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (menuCheckbox && menuCheckbox.checked) {
      menuCheckbox.checked = false;
    }
  });
});
