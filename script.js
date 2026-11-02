// ==========================================================================
// PORTAFOLIO DANZELL PAOLO - SCRIPT PRINCIPAL CON ANIME.JS
// ==========================================================================

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

// Barra de progreso de lectura y sombra dinámica en la navbar
const navbar = document.querySelector('.navbar');
const scrollProgressBar = document.getElementById('scrollProgressBar');

window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  
  if (scrollProgressBar) {
    scrollProgressBar.style.width = scrolled + '%';
  }

  if (navbar) {
    if (winScroll > 25) {
      navbar.style.boxShadow = '0 8px 28px -4px rgba(13, 15, 18, 0.08)';
      navbar.style.background = 'rgba(251, 250, 247, 0.96)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(251, 250, 247, 0.88)';
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

// ==========================================================================
// Animaciones de Entrada con Anime.js
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initScrollAnimations();
  initStatsCounter();
  initSkillBars();
  initMagneticButtons();
  initFormInteractions();
});

// Animación timeline del Hero al cargar
function initHeroAnimations() {
  if (typeof anime === 'undefined') return;

  const heroTL = anime.timeline({
    easing: 'easeOutExpo'
  });

  heroTL
    .add({
      targets: '.photo-ring',
      scale: [0.82, 1],
      opacity: [0, 1],
      duration: 1100,
      easing: 'easeOutElastic(1, 0.75)'
    })
    .add({
      targets: '.hero-tag',
      translateY: [18, 0],
      opacity: [0, 1],
      duration: 650
    }, '-=750')
    .add({
      targets: '.hero-name',
      translateY: [28, 0],
      opacity: [0, 1],
      duration: 750
    }, '-=500')
    .add({
      targets: ['.hero-subtitle', '.hero-bio'],
      translateY: [22, 0],
      opacity: [0, 1],
      duration: 700,
      delay: anime.stagger(100)
    }, '-=550')
    .add({
      targets: '.hero-nav-circles .circle-btn',
      scale: [0.75, 1],
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 750,
      delay: anime.stagger(80),
      easing: 'easeOutBack'
    }, '-=500');
}

// Animación de aparición suave escalonada en scroll con Anime.js
function initScrollAnimations() {
  const fadeEls = document.querySelectorAll(
    '.stat-card, .skill-group, .about-text, .about-stats, .modular-card, .deck-contenedor, .section-title, .section-label, .contact-form, .social-links'
  );

  // Inicializar estado oculto de manera progresiva
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.willChange = 'transform, opacity';
  });

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (typeof anime !== 'undefined') {
          anime({
            targets: entry.target,
            translateY: [24, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutCubic'
          });
        } else {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));
}

// Animación de contador numérico para estadísticas con Anime.js
function initStatsCounter() {
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length === 0) return;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNum = entry.target.querySelector('.stat-num[data-target]');
        if (statNum) {
          const target = parseInt(statNum.getAttribute('data-target'), 10);
          const prefix = statNum.getAttribute('data-prefix') || '';

          if (typeof anime !== 'undefined') {
            const counter = { val: 0 };
            anime({
              targets: counter,
              val: target,
              round: 1,
              duration: 1500,
              easing: 'easeOutExpo',
              update: () => {
                statNum.textContent = prefix + counter.val;
              }
            });
          } else {
            statNum.textContent = prefix + target;
          }
        }
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statCards.forEach(card => countObserver.observe(card));
}

// Animación de llenado de barras de habilidades con Anime.js
function initSkillBars() {
  const skillsSection = document.getElementById('habilidades');
  if (!skillsSection) return;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = skillsSection.querySelectorAll('.fill[data-width]');
        fills.forEach((fill, index) => {
          const targetWidth = fill.getAttribute('data-width');
          if (typeof anime !== 'undefined') {
            anime({
              targets: fill,
              width: ['0%', targetWidth],
              duration: 1300,
              delay: index * 90,
              easing: 'easeOutCubic'
            });
          } else {
            fill.style.width = targetWidth;
          }
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  skillObserver.observe(skillsSection);
}

// Microinteracción magnética elástica en los botones circulares del Hero
function initMagneticButtons() {
  document.querySelectorAll('.circle-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18 - 8}px) scale(1.12)`;
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof anime !== 'undefined') {
        anime({
          targets: btn,
          translateX: 0,
          translateY: 0,
          scale: 1,
          duration: 600,
          easing: 'easeOutElastic(1, 0.6)'
        });
      } else {
        btn.style.transform = '';
      }
    });
  });
}

// Micro-interacción al enfocar los inputs del formulario
function initFormInteractions() {
  if (typeof anime === 'undefined') return;

  document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('focus', () => {
      anime({
        targets: input,
        scale: [1, 1.01],
        duration: 250,
        easing: 'easeOutQuad'
      });
    });

    input.addEventListener('blur', () => {
      anime({
        targets: input,
        scale: 1,
        duration: 250,
        easing: 'easeOutQuad'
      });
    });
  });
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
      if (typeof anime !== 'undefined') {
        anime({
          targets: card,
          scale: [0.96, 1],
          opacity: [0.85, 1],
          duration: 450,
          easing: 'easeOutQuad'
        });
      }
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

// Efecto 3D Tilt dinámico con el mouse en la tarjeta activa
const deckContainer = document.querySelector('.deck-contenedor');
if (deckContainer) {
  deckContainer.addEventListener('mousemove', (e) => {
    const principal = document.querySelector('.deck-card.principal');
    if (!principal) return;
    const rect = principal.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    if (Math.abs(x) < rect.width * 1.2 && Math.abs(y) < rect.height * 1.2) {
      const rotX = (y / (rect.height / 2)) * -6;
      const rotY = (x / (rect.width / 2)) * 6;
      principal.style.transform = `scale(1.02) translateZ(12px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    }
  });

  deckContainer.addEventListener('mouseleave', () => {
    const principal = document.querySelector('.deck-card.principal');
    if (principal) {
      principal.style.transform = '';
    }
  });

  // Auto-slide suave cada 6.5s con pausa automática al pasar el cursor o tocar
  let autoSlideTimer = null;
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      if (currentStep < totalCards) {
        nextCard();
      } else {
        currentStep = 1;
        updateDeck();
      }
    }, 6500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  deckContainer.addEventListener('mouseenter', stopAutoSlide);
  deckContainer.addEventListener('mouseleave', startAutoSlide);
  deckContainer.addEventListener('touchstart', stopAutoSlide, { passive: true });
  startAutoSlide();
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

// ==========================================================================
// Manejo Funcional del Formulario de Contacto (FormSubmit AJAX + Anime.js)
// ==========================================================================
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('.btn-submit');
  const statusBox = document.getElementById('formStatus');
  const originalBtnText = submitBtn.innerHTML;

  const name = document.getElementById('contactName')?.value.trim() || '';
  const email = document.getElementById('contactEmail')?.value.trim() || '';
  const subject = document.getElementById('contactSubject')?.value.trim() || '';
  const message = document.getElementById('contactMessage')?.value.trim() || '';

  // Validación básica
  if (!name || !email || !message) {
    showFormStatus('error', 'Por favor completa todos los campos requeridos para enviar tu mensaje.');
    return;
  }

  // Estado de envío con micro-animación Anime.js
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Enviando...';

  if (typeof anime !== 'undefined') {
    anime({
      targets: submitBtn,
      scale: [1, 0.96, 1],
      duration: 650,
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  const payload = {
    nombre: name,
    email: email,
    asunto: subject || 'Contacto desde tu portafolio',
    mensaje: message,
    _subject: `Nuevo mensaje de ${name} desde tu portafolio`,
    _template: 'table'
  };

  try {
    const response = await fetch('https://formsubmit.co/ajax/danzellpaolo1234@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (typeof anime !== 'undefined') {
      anime.remove(submitBtn);
      anime({ targets: submitBtn, scale: 1, duration: 200 });
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
      submitBtn.innerHTML = 'Mensaje enviado';
      submitBtn.style.background = '#00c9a7';
      showFormStatus('success', '¡Tu mensaje ha sido enviado exitosamente! Me pondré en contacto contigo a la brevedad.');
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.background = '';
      }, 4500);
    } else {
      throw new Error(data.message || 'Error en el servidor de envío');
    }
  } catch (error) {
    if (typeof anime !== 'undefined') {
      anime.remove(submitBtn);
      anime({ targets: submitBtn, scale: 1, duration: 200 });
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
    submitBtn.style.background = '';

    showFormStatus('error', 'No se pudo conectar con el servidor de correo. Abriendo tu cliente de correo como respaldo directo...');

    // Respaldo inmediato vía mailto para asegurar que el mensaje nunca se pierda
    const mailtoUri = `mailto:danzellpaolo1234@gmail.com?subject=${encodeURIComponent((subject || 'Contacto') + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nDe: ' + name + ' (' + email + ')')}`;
    setTimeout(() => {
      window.location.href = mailtoUri;
    }, 1200);
  }
}

function showFormStatus(type, message) {
  const statusBox = document.getElementById('formStatus');
  if (!statusBox) return;

  statusBox.className = `form-status ${type}`;
  statusBox.textContent = message;
  statusBox.style.display = 'block';

  if (typeof anime !== 'undefined') {
    anime({
      targets: statusBox,
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 400,
      easing: 'easeOutCubic'
    });
  }
}
