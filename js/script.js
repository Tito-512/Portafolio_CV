/**
 * Currículum Vitae Profesional - Cristopher González Martínez
 * Funcionalidades interactivas: navegación responsiva, animaciones de aparición,
 * carrusel de documentos oficiales y visor ampliado (lightbox).
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. MENÚ DE NAVEGACIÓN RESPONSIVO Y RESALTADO DE SECCIÓN ACTIVA
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Sombra en barra de navegación
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 20);
    }

    // Mostrar u ocultar botón para regresar al inicio
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollY > 420);
    }

    // Marcar enlace activo según la sección visible
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     2. ANIMACIONES DISCRETAS AL APARECER LAS SECCIONES (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------------
     3. CARRUSEL INTERACTIVO DE CERTIFICADOS Y DOCUMENTOS
     ------------------------------------------------------------------------ */
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  const counterEl = document.getElementById('carouselCounter');

  let currentIndex = 0;
  const totalSlides = slides.length;

  const updateCarousel = (newIndex) => {
    if (totalSlides === 0) return;
    currentIndex = (newIndex + totalSlides) % totalSlides;

    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    indicators.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentIndex);
      btn.setAttribute('aria-selected', String(idx === currentIndex));
    });

    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
  }

  indicators.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetIndex = Number(btn.dataset.slide);
      if (!Number.isNaN(targetIndex)) {
        updateCarousel(targetIndex);
      }
    });
  });

  // Soporte táctil (swipe) para dispositivos móviles en el carrusel
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    track.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const deltaX = touchStartX - touchEndX;
        if (Math.abs(deltaX) > 45) {
          if (deltaX > 0) {
            updateCarousel(currentIndex + 1);
          } else {
            updateCarousel(currentIndex - 1);
          }
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     4. MODAL / LIGHTBOX PARA VISUALIZACIÓN AMPLIADA DE DOCUMENTOS
     ------------------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let lightboxIndex = 0;

  const renderLightboxContent = (index) => {
    lightboxIndex = (index + totalSlides) % totalSlides;
    const slide = slides[lightboxIndex];
    if (!slide) return;

    const img = slide.querySelector('img');
    const title = slide.querySelector('.slide-caption h4');
    const desc = slide.querySelector('.slide-caption p');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    if (lightboxTitle && title) {
      lightboxTitle.textContent = title.textContent;
    }
    if (lightboxCaption && desc) {
      lightboxCaption.textContent = desc.textContent;
    }
  };

  const openLightbox = (index) => {
    if (!lightbox) return;
    renderLightboxContent(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  slides.forEach((slide, idx) => {
    const frame = slide.querySelector('.doc-frame');
    if (frame) {
      frame.addEventListener('click', () => openLightbox(idx));
      frame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    }
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  if (lbPrev) {
    lbPrev.addEventListener('click', () => {
      renderLightboxContent(lightboxIndex - 1);
      updateCarousel(lightboxIndex);
    });
  }

  if (lbNext) {
    lbNext.addEventListener('click', () => {
      renderLightboxContent(lightboxIndex + 1);
      updateCarousel(lightboxIndex);
    });
  }

  // Navegación con teclado (Escape, Flecha izquierda y derecha)
  document.addEventListener('keydown', (e) => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        renderLightboxContent(lightboxIndex - 1);
        updateCarousel(lightboxIndex);
      }
      if (e.key === 'ArrowRight') {
        renderLightboxContent(lightboxIndex + 1);
        updateCarousel(lightboxIndex);
      }
    }
  });
});
