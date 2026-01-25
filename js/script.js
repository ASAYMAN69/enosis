document.addEventListener('DOMContentLoaded', () => {

    /* ================= HERO SLIDER ================= */
    const slides = document.querySelectorAll('.hero-slide');

    if (slides.length > 0) {
        let currentSlide = 0;
        let autoSlideInterval;

        function changeSlide(direction) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + direction + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            resetAutoSlide();
        }

        function autoSlide() {
            changeSlide(1);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(autoSlide, 3000);
        }

        autoSlideInterval = setInterval(autoSlide, 3000);
    }

    /* ================= NAVBAR ================= */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');

    if (hamburger && navLinks && navbar) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    });

    /* ================= SCROLL ANIMATIONS ================= */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    /* ================= SMOOTH SCROLL ================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ================= COUNTERS ================= */
    const counters = document.querySelectorAll('.stat-number');
    const speed = 50;

    const animateCounter = counter => {
        const target = +counter.dataset.target;
        let count = 0;
        const increment = target / speed;

        const update = () => {
            count += increment;
            if (count < target) {
                counter.innerText = Math.ceil(count) + '+';
                setTimeout(update, 10);
            } else {
                counter.innerText = target + '+';
            }
        };
        update();
    };

    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => statsObserver.observe(counter));

    /* ================= ACTIVE NAV LINK ================= */
    function setActiveNavLink() {
        const links = document.querySelectorAll('.nav-links a');
        const path = window.location.pathname.replace(/\/$/, '') || '/';

        let bestMatch = null;
        let longest = 0;

        links.forEach(link => {
            const href = link.getAttribute('href').replace(/\/$/, '') || '/';
            if (path.startsWith(href) && href.length > longest) {
                longest = href.length;
                bestMatch = link;
            }
        });

        links.forEach(l => l.classList.remove('active'));
        if (bestMatch) bestMatch.classList.add('active');
    }

    setActiveNavLink();

});
