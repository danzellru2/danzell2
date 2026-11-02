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
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        setActiveSection(href.substring(1));
      }
    });
  });
}

// Botones circulares del Hero (sincronizan también la sección activa al hacer clic)
document.querySelectorAll('.hero-nav-circles .circle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const href = btn.getAttribute('href');
    if (href && href.startsWith('#')) {
      setActiveSection(href.substring(1));
    }
  });
});

// Barra de progreso de lectura y sombra dinámica en la navbar
const navbar = document.querySelector('.navbar');
const scrollProgressBar = document.getElementById('scrollProgressBar');

// ==========================================================================
// ScrollSpy Preciso y Determinista
// ==========================================================================
const sections = Array.from(document.querySelectorAll('section[id]'));
const allNavLinks = Array.from(document.querySelectorAll('.nav-link'));

function setActiveSection(id) {
  if (!id) return;
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' + id) {
      link.classList.add('active');
    } else if (href && href.startsWith('#')) {
      link.classList.remove('active');
    }
  });
}

function updateActiveNavLink() {
  if (!sections.length) return;

  const scrollY = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;

  // 1. Caso extremo: Final de la página alcanzado -> activar 'contacto' sin ambigüedad
  if (scrollY + windowHeight >= docHeight - 60) {
    setActiveSection('contacto');
    return;
  }

  // 2. Caso extremo: Inicio de la página -> activar 'inicio'
  if (scrollY < 120) {
    setActiveSection('inicio');
    return;
  }

  // 3. Determinar qué sección cruza el checkpoint de lectura (180px, debajo de la navbar fija)
  const checkpoint = 180;
  let activeId = 'inicio';

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const rect = sec.getBoundingClientRect();
    if (rect.top <= checkpoint) {
      activeId = sec.id;
    }
  }

  if (activeId) {
    setActiveSection(activeId);
  }
}

// Evento de scroll con requestAnimationFrame para máximo rendimiento
let isScrolling = false;
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

  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      updateActiveNavLink();
      isScrolling = false;
    });
    isScrolling = true;
  }
}, { passive: true });

window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#')) {
    setActiveSection(hash.substring(1));
  }
});

// ==========================================================================
// Inicialización y Animaciones de Entrada con Anime.js
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNavLink();
  initHeroAnimations();
  initScrollAnimations();
  initStatsCounter();
  initSkillBars();
  initMagneticButtons();
  initFloatingLabels();
  initSubjectPills();

  const btnReset = document.getElementById('btnResetForm');
  if (btnReset) {
    btnReset.addEventListener('click', resetFormState);
  }
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
    '.stat-card, .skill-group, .about-text, .about-stats, .modular-card, .deck-contenedor, .contacto-info, .contact-card, .section-title, .section-label'
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

// ==========================================================================
// Componente de Formulario Interactivo (Floating Labels & Subject Pills)
// ==========================================================================
function initFloatingLabels() {
  const inputs = document.querySelectorAll('.fi-input');
  inputs.forEach(input => {
    const box = input.closest('.fi-box');
    const label = box?.querySelector('.fi-label');
    if (!box || !label) return;

    if (input.value && input.value.trim().length > 0) {
      label.classList.add('fi-up');
    }

    input.addEventListener('focus', () => {
      box.classList.add('fi-focused');
      label.classList.add('fi-up');
      if (typeof anime !== 'undefined') {
        anime({
          targets: box,
          scale: [1, 1.01],
          duration: 200,
          easing: 'easeOutSine'
        });
      }
    });

    input.addEventListener('blur', () => {
      box.classList.remove('fi-focused');
      if (!input.value || input.value.trim().length === 0) {
        label.classList.remove('fi-up');
      }
      if (typeof anime !== 'undefined') {
        anime({
          targets: box,
          scale: 1,
          duration: 250,
          easing: 'easeOutSine'
        });
      }
    });

    input.addEventListener('input', () => {
      if (input.value.trim().length > 0) {
        label.classList.add('fi-up');
        box.classList.remove('fi-error');
        const wrap = box.closest('.fi-wrap');
        const errSpan = wrap?.querySelector('.fi-err');
        if (errSpan) errSpan.style.display = 'none';
      }
    });
  });
}

function initSubjectPills() {
  const pills = document.querySelectorAll('.pill-row .pill');
  const subjectInput = document.getElementById('selectedSubjectInput');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('pill-on'));
      pill.classList.add('pill-on');
      const chosen = pill.getAttribute('data-subject') || '';
      if (subjectInput) {
        subjectInput.value = chosen;
      }
      if (typeof anime !== 'undefined') {
        anime({
          targets: pill,
          scale: [0.94, 1.06, 1],
          duration: 320,
          easing: 'easeOutBack'
        });
      }
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
// Animación Mejorada del Avión de Papel & Envío del Formulario (Web3Forms)
// ==========================================================================
let isSubmitting = false;

async function handleSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('submitBtn');

  let hasErrors = false;

  function validateField(input, wrapId, errId, errorMsg) {
    const wrap = document.getElementById(wrapId);
    const box = wrap?.querySelector('.fi-box');
    const err = document.getElementById(errId);

    if (!input || !input.value.trim()) {
      hasErrors = true;
      if (box) box.classList.add('fi-error');
      if (err) {
        err.textContent = errorMsg;
        err.style.display = 'block';
      }
      if (typeof anime !== 'undefined' && wrap) {
        anime({
          targets: wrap,
          translateX: [0, -8, 8, -6, 6, -3, 3, 0],
          duration: 450,
          easing: 'easeInOutSine'
        });
      }
    } else {
      if (box) box.classList.remove('fi-error');
      if (err) err.style.display = 'none';
    }
  }

  // Validación de campos
  validateField(nameInput, 'wrapName', 'errName', 'Escribe tu nombre');
  validateField(emailInput, 'wrapEmail', 'errEmail', 'Escribe un correo válido');
  validateField(messageInput, 'wrapMessage', 'errMessage', 'Escribe tu mensaje');

  if (hasErrors || isSubmitting) {
    return;
  }

  isSubmitting = true;
  if (submitBtn) {
    submitBtn.style.pointerEvents = 'none';
    submitBtn.disabled = true;
  }

  const formData = new FormData(form);

  let animationFinished = false;
  let submissionFinished = false;
  let isSuccessful = false;

  function finalize() {
    if (animationFinished && submissionFinished) {
      if (isSuccessful) {
        showSuccessScreen();
      } else {
        alert('Hubo un inconveniente al enviar por la red. Se abrirá tu cliente de correo como respaldo directo.');
        const subject = encodeURIComponent(document.getElementById('selectedSubjectInput')?.value || 'Contacto');
        const body = encodeURIComponent(`Nombre: ${nameInput.value}\nCorreo: ${emailInput.value}\n\n${messageInput.value}`);
        window.location.href = `mailto:danzellpaolo1234@gmail.com?subject=${subject}&body=${body}`;
        resetFormState();
      }
      isSubmitting = false;
    }
  }

  // Iniciar la animación cinematográfica del avión de papel
  animatePaperPlaneFlight(() => {
    animationFinished = true;
    finalize();
  });

  // Envío asíncrono directo a Web3Forms
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (res.ok && data.success) {
      isSuccessful = true;
    } else {
      if (form) {
        form.target = 'web3forms_iframe';
        form.submit();
        isSuccessful = true;
      }
    }
  } catch (err) {
    console.warn('Fallback a envío nativo:', err);
    if (form) {
      form.target = 'web3forms_iframe';
      form.submit();
      isSuccessful = true;
    }
  } finally {
    submissionFinished = true;
    finalize();
  }
}

// Animación Cinematográfica del Avión de Papel con Anime.js
function animatePaperPlaneFlight(onComplete) {
  const flyer = document.getElementById('paperPlaneFlyer');
  const formInner = document.querySelector('.form-inner');
  const submitBtn = document.getElementById('submitBtn');
  const btnIcon = submitBtn?.querySelector('.btn-plane-icon');
  const flightTrail = document.getElementById('flightTrailPath');

  if (!flyer || typeof anime === 'undefined') {
    if (onComplete) onComplete();
    return;
  }

  // Mostrar el avión listo para despegue
  flyer.style.display = 'block';
  flyer.style.opacity = '1';
  flyer.style.transform = 'translate(0px, 0px) scale(0.65) rotate(0deg)';

  // Desvanecer con empuje el icono dentro del botón
  if (btnIcon) {
    anime({
      targets: btnIcon,
      translateX: [0, 8],
      translateY: [0, -10],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeOutQuad'
    });
  }

  // Preparar la estela de propulsión
  if (flightTrail) {
    flightTrail.style.strokeDashoffset = '320';
    flightTrail.style.strokeDasharray = '320';
  }

  const flightTL = anime.timeline({
    easing: 'easeOutExpo'
  });

  flightTL
    // 1. Tensión previa / Retroceso para coger impulso aerodinámico (wind-up)
    .add({
      targets: flyer,
      translateX: [0, -26],
      translateY: [0, 18],
      rotateZ: [0, 12],
      scale: [0.65, 1.05],
      duration: 380,
      easing: 'easeOutQuad'
    })
    // 2. Aceleración a chorro en ascenso con peralte dinámico 3D
    .add({
      targets: flyer,
      translateX: [-26, 130],
      translateY: [18, -60],
      rotateZ: [12, -26],
      scale: [1.05, 1.35],
      duration: 440,
      easing: 'cubicBezier(0.4, 0, 0.2, 1)'
    }, '-=60')
    // Estela de viento y luz que sigue al avión
    .add({
      targets: flightTrail,
      strokeDashoffset: [320, 0],
      opacity: [0.2, 1, 0],
      duration: 720,
      easing: 'easeOutSine'
    }, '-=440')
    // 3. Rizo acrobático supersónico saliendo de la tarjeta por la esquina superior derecha
    .add({
      targets: flyer,
      translateX: [130, 440],
      translateY: [-60, -340],
      rotateZ: [-26, -52],
      scale: [1.35, 0.4],
      opacity: [1, 0],
      duration: 620,
      easing: 'cubicBezier(0.25, 0.1, 0.25, 1)'
    }, '-=100');

  // Desvanecer el formulario al unísono con el vuelo
  anime({
    targets: formInner,
    opacity: [1, 0],
    translateY: [0, -14],
    duration: 400,
    delay: 480,
    easing: 'easeInCubic',
    complete: () => {
      flyer.style.display = 'none';
      if (onComplete) onComplete();
    }
  });
}

// Chispas de celebración orbitales (armónicas, sin arcoíris)
function createSparks() {
  const container = document.getElementById('scSparks');
  if (!container) return;
  container.innerHTML = '';
  // Paleta nítida del portafolio: esmeralda, naranja cálido, azul cian, ámbar
  const colors = ['#00c9a7', '#ff5c00', '#0284c7', '#ffb703', '#ffffff'];
  for (let i = 0; i < 10; i++) {
    const spark = document.createElement('div');
    spark.className = 'sc-spark';
    const size = (i % 2 === 0) ? 8 : 5;
    spark.style.width = size + 'px';
    spark.style.height = size + 'px';
    spark.style.background = colors[i % colors.length];
    spark.style.boxShadow = `0 0 8px ${colors[i % colors.length]}`;
    container.appendChild(spark);
  }
}

// Mostrar pantalla de éxito al aterrizar el mensaje
function showSuccessScreen() {
  const successWrap = document.getElementById('successWrap');
  const formInner = document.querySelector('.form-inner');
  const contactCard = document.getElementById('contactCard');
  if (!successWrap) return;

  // Garantizar que la tarjeta conserve su altura estructural
  if (contactCard) {
    contactCard.style.minHeight = '560px';
  }

  // Ocultar formulario manteniendo el espacio estructural de la tarjeta
  if (formInner) {
    formInner.style.visibility = 'hidden';
    formInner.style.pointerEvents = 'none';
  }

  createSparks();
  successWrap.style.display = 'flex';
  successWrap.style.opacity = '1';

  if (typeof anime !== 'undefined') {
    const successTL = anime.timeline({
      easing: 'easeOutExpo'
    });

    successTL
      .add({
        targets: successWrap,
        opacity: [0, 1],
        duration: 350
      })
      .add({
        targets: '.sc-ring',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 750,
        easing: 'easeOutBack(2)'
      }, '-=150')
      .add({
        targets: '.sc-check',
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 600,
        easing: 'easeOutCubic'
      }, '-=350')
      .add({
        targets: '.sc-spark',
        translateX: (el, i) => [0, 60 * Math.cos((i / 10) * Math.PI * 2)],
        translateY: (el, i) => [0, 60 * Math.sin((i / 10) * Math.PI * 2)],
        scale: [1.2, 0],
        opacity: [1, 0],
        duration: 800,
        delay: anime.stagger(30),
        easing: 'easeOutCubic'
      }, '-=500')
      .add({
        targets: '.sc-plane-done',
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.75, 1],
        duration: 500,
        easing: 'easeOutBack'
      }, '-=300')
      .add({
        targets: ['.sc-title', '.sc-sub', '.sc-reset'],
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(80),
        duration: 500
      }, '-=300');
  } else {
    successWrap.style.opacity = '1';
  }
}

// Reiniciar formulario para enviar otro mensaje
function resetFormState() {
  const successWrap = document.getElementById('successWrap');
  const formInner = document.querySelector('.form-inner');
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnIcon = submitBtn?.querySelector('.btn-plane-icon');

  if (typeof anime !== 'undefined' && successWrap) {
    anime({
      targets: successWrap,
      opacity: [1, 0],
      duration: 280,
      easing: 'easeInQuad',
      complete: () => {
        successWrap.style.display = 'none';
        if (form) form.reset();
        document.querySelectorAll('.fi-label').forEach(lbl => lbl.classList.remove('fi-up'));
        document.querySelectorAll('.fi-box').forEach(b => b.classList.remove('fi-focused', 'fi-error'));
        if (btnIcon) {
          btnIcon.style.opacity = '1';
          btnIcon.style.transform = '';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.pointerEvents = 'auto';
        }
        if (formInner) {
          formInner.style.visibility = 'visible';
          formInner.style.pointerEvents = 'auto';
          anime({
            targets: formInner,
            opacity: [0, 1],
            translateY: [-10, 0],
            duration: 350,
            easing: 'easeOutCubic'
          });
        }
      }
    });
  } else {
    if (successWrap) successWrap.style.display = 'none';
    if (form) form.reset();
    if (formInner) {
      formInner.style.visibility = 'visible';
      formInner.style.pointerEvents = 'auto';
      formInner.style.opacity = '1';
    }
    if (submitBtn) submitBtn.disabled = false;
  }
}
