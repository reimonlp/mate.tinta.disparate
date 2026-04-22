// --- LÓGICA DE NAVEGACIÓN (IntersectionObserver) ---
// Usamos una API moderna para detectar cuándo el hero sale de pantalla sin sobrecargar el scroll
const hero = document.getElementById('main-hero');
const placeholder = document.querySelector('.hero-placeholder');

if (hero && placeholder) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si el placeholder no es visible, activamos la barra compacta
      if (!entry.isIntersecting) {
        hero.classList.add('compacto');
      } else {
        hero.classList.remove('compacto');
      }
    });
  }, { threshold: 0.1 }); // Se activa al salir el 90% del hero

  observer.observe(placeholder);
}

// --- LÓGICA DE GALERÍA (Delegación de Eventos) ---
const galeria = document.getElementById('galeria-encuentros');
const visor = document.getElementById('visualizador');
const imgFull = document.getElementById('img-full');

if (galeria && visor && imgFull) {
  galeria.addEventListener('click', (e) => {
    const item = e.target.closest('.foto-item');
    if (!item) return;
    const img = item.querySelector('img');
    imgFull.src = img.src;
    imgFull.alt = img.alt || 'Momento de encuentro';
    visor.classList.add('activo');
    document.body.style.overflow = 'hidden';
  });

  const cerrarVisor = () => {
    visor.classList.remove('activo');
    document.body.style.overflow = '';
  };

  visor.addEventListener('click', (e) => {
    if (e.target === visor || e.target.closest('.cerrar')) cerrarVisor();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarVisor();
  });
}

// --- MENÚ MÓVIL (Sincronización) ---
const menuCb = document.getElementById('menu-cb');
if (menuCb) {
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => { menuCb.checked = false; });
  });
}
