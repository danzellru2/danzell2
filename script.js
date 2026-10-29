// Control del menú móvil
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Sombra dinámica en la barra de navegación al hacer scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 25) {
      navbar.style.boxShadow = '0 8px 24px -4px rgba(0, 0, 0, 0.08)';
      navbar.style.background = 'rgba(248, 246, 240, 0.95)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(248, 246, 240, 0.9)';
    }
  }
});

// Navegación activa con scroll
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(sec => observer.observe(sec));

// Animación de aparición suave escalonada al hacer scroll
const fadeEls = document.querySelectorAll(
  '.stat-card, .skill-group, .about-text, .about-stats, .modular-card, .deck-contenedor, .section-title, .section-label, .contact-form, .social-links'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

// Estilos de animación en JavaScript para garantizar carga fluida y aceleración por GPU
const animStyle = document.createElement('style');
animStyle.textContent = `
  .stat-card, .skill-group, .about-text, .about-stats, .modular-card, .deck-contenedor, .contact-form, .social-links {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
  }
  .section-title, .section-label {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
  }
  .fade-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(animStyle);

// Animación de llenado de barras de habilidades al entrar en pantalla
const skillBars = document.querySelectorAll('.fill[data-width]');
const skillsSection = document.getElementById('habilidades');

if (skillsSection && skillBars.length > 0) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width');
          if (targetWidth) {
            bar.style.width = targetWidth;
          }
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  skillObserver.observe(skillsSection);
}

// ==========================================================================
// Funcionalidad 3D Card Deck (Carrusel de Tarjetas en Perspectiva)
// ==========================================================================
let currentStep = 1;
const totalCards = 6;

function updateDeck() {
  for (let i = 1; i <= totalCards; i++) {
    const card = document.getElementById(`card-${i}`);
    if (!card) continue;

    // Remover clases de posición
    card.classList.remove(
      'principal', 'siguiente', 'siguiente2', 'anterior', 'anterior2',
      'oculto-derecha', 'oculto-izquierda'
    );

    const diff = i - currentStep;
    if (diff === 0) {
      card.classList.add('principal');
    } else if (diff === 1) {
      card.classList.add('siguiente');
    } else if (diff === 2) {
      card.classList.add('siguiente2');
    } else if (diff > 2) {
      card.classList.add('oculto-derecha');
    } else if (diff === -1) {
      card.classList.add('anterior');
    } else if (diff === -2) {
      card.classList.add('anterior2');
    } else if (diff < -2) {
      card.classList.add('oculto-izquierda');
    }

    // Actualizar puntos de navegación de cada tarjeta
    const dots = card.querySelectorAll('.dot');
    dots.forEach((dot, dotIdx) => {
      dot.classList.toggle('active-dot', dotIdx === (currentStep - 1));
    });
  }

  // Zonas transparentes para clic lateral
  const prevZone = document.getElementById('div-transparent-previous');
  const nextZone = document.getElementById('div-transparent-next');

  if (prevZone) {
    if (currentStep <= 1) {
      prevZone.classList.add('ocultar');
    } else {
      prevZone.classList.remove('ocultar');
    }
  }

  if (nextZone) {
    if (currentStep >= totalCards) {
      nextZone.classList.add('ocultar');
    } else {
      nextZone.classList.remove('ocultar');
    }
  }
}

function nextCard() {
  if (currentStep < totalCards) {
    currentStep++;
    updateDeck();
  }
}

function previousCard() {
  if (currentStep > 1) {
    currentStep--;
    updateDeck();
  }
}

// Soporte de arrastre/swipe táctil para dispositivos móviles
let touchStartX = 0;

function onTouchStart(event) {
  touchStartX = event.changedTouches[0].clientX;
}

function onTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX;
  const deltaX = touchStartX - touchEndX;

  if (deltaX > 45 && currentStep < totalCards) {
    nextCard();
  } else if (deltaX < -45 && currentStep > 1) {
    previousCard();
  }
}

// Inicializar estado del deck
updateDeck();

// Manejo del formulario de contacto
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn-submit');
  const name = document.getElementById('contactName')?.value || '';
  const email = document.getElementById('contactEmail')?.value || '';
  const subject = document.getElementById('contactSubject')?.value || '';
  const message = document.getElementById('contactMessage')?.value || '';

  const originalText = btn.textContent;
  btn.textContent = 'Enviado';
  btn.style.background = '#2ec4b6';

  // Abrir cliente de correo con los datos redactados
  const mailtoUri = `mailto:danzellpaolo1234@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nDe: ' + name + ' (' + email + ')')}`;
  window.location.href = mailtoUri;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    form.reset();
  }, 3500);
}
