/* =============================================
   NDOKI NIGERIA - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Header Scroll Effect ----
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile Navigation ----
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileDropdownToggles = document.querySelectorAll('.mobile-nav__toggle');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Mobile dropdown toggles
        mobileDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = toggle.closest('.mobile-nav__dropdown');
                parent.classList.toggle('active');
            });
        });
    }

    // ---- Hero Slider ----
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_DURATION = 6000;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('hero__slide--active');
        dots[currentSlide].classList.remove('hero__dot--active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('hero__slide--active');
        dots[currentSlide].classList.add('hero__dot--active');

        // Re-trigger content animations
        const content = slides[currentSlide].querySelector('.hero__content');
        if (content) {
            const animatedElements = content.querySelectorAll('.hero__tagline, .hero__title, .hero__subtitle, .btn');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // force reflow
                el.style.animation = '';
            });
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    if (slides.length > 0) {
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                goToSlide(index);
                startAutoplay();
            });
        });

        startAutoplay();
    }

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Active Nav Link on Scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function setActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', setActiveNav, { passive: true });

    // ---- Scroll Reveal Animations ----
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes to elements
    const animateElements = [
        ...document.querySelectorAll('.categories__card'),
        ...document.querySelectorAll('.featured__item'),
        ...document.querySelectorAll('.values__item'),
        ...document.querySelectorAll('.about__image-col'),
        ...document.querySelectorAll('.about__content-col'),
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.contact__info'),
        ...document.querySelectorAll('.contact__form'),
        ...document.querySelectorAll('.trybe__content'),
        ...document.querySelectorAll('.newsletter__inner'),
    ];

    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index % 4 * 0.1}s`;
        observer.observe(el);
    });

    // Special animations for about section columns
    const aboutImageCol = document.querySelector('.about__image-col');
    const aboutContentCol = document.querySelector('.about__content-col');
    if (aboutImageCol) {
        aboutImageCol.classList.remove('fade-in');
        aboutImageCol.classList.add('fade-in-left');
        observer.observe(aboutImageCol);
    }
    if (aboutContentCol) {
        aboutContentCol.classList.remove('fade-in');
        aboutContentCol.classList.add('fade-in-right');
        observer.observe(aboutContentCol);
    }

    // ---- Newsletter Form ----
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter__input');
            if (input.value.trim()) {
                const btn = newsletterForm.querySelector('.btn');
                btn.textContent = 'Subscribed!';
                btn.style.background = '#2a5a2a';
                btn.style.borderColor = '#2a5a2a';
                btn.style.color = '#fff';
                input.value = '';
                setTimeout(() => {
                    btn.textContent = 'Subscribe';
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                }, 3000);
            }
        });
    }

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn');
            btn.textContent = 'Message Sent!';
            btn.style.background = '#2a5a2a';
            btn.style.borderColor = '#2a5a2a';
            contactForm.reset();
            setTimeout(() => {
                btn.textContent = 'Send Message';
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 3000);
        });
    }

    // ---- Touch/Swipe Support for Hero Slider ----
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSlider = document.getElementById('heroSlider');

    if (heroSlider) {
        heroSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoplay();
            }
        }, { passive: true });
    }

    // ---- Parallax effect on trybe background ----
    const trybeBg = document.querySelector('.trybe__bg');
    if (trybeBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const trybeSection = document.querySelector('.trybe');
            const sectionTop = trybeSection.offsetTop;
            const sectionHeight = trybeSection.offsetHeight;

            if (scrolled + window.innerHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                const parallaxOffset = (scrolled - sectionTop) * 0.3;
                trybeBg.style.transform = `translateY(${parallaxOffset}px)`;
            }
        }, { passive: true });
    }

});