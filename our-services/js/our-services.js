const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 0) {
    let currentSlide = 0;
    let autoSlideInterval;

    function changeSlide(direction) {
        const totalSlides = slides.length;
        
        slides[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        
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

    // Start auto-sliding
    autoSlideInterval = setInterval(autoSlide, 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Add parallax effect to hero
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     if (hero && scrolled < hero.offsetHeight) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hamburger Menu

const hamburger = document.querySelector('.hamburger');

const navLinks = document.querySelector('.nav-links');



hamburger.addEventListener('click', () => {



    hamburger.classList.toggle('active');



    navLinks.classList.toggle('active');



});







document.addEventListener('click', (e) => {



    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {



        hamburger.classList.remove('active');



        navLinks.classList.remove('active');



    }



});

// Set active navigation link based on current page
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    let currentPath = window.location.pathname;

    // Normalize currentPath: remove "index.html" and trailing slashes
    currentPath = currentPath.replace(/(\/index\.html)?\/?$/, '');
    if (currentPath === '') { // Handle root path specifically
        currentPath = '/';
    }

    navLinks.forEach(link => {
        link.classList.remove('active'); // Remove active from all links first

        let linkPath = link.getAttribute('href');

        // Normalize linkPath: remove trailing slashes
        linkPath = linkPath.replace(/\/$/, '');

        // Check for exact match first
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else if (currentPath.startsWith(linkPath) && linkPath !== '/') {
            // For sub-paths, ensure it's not just a partial match of a longer path
            // e.g., /about-us should not activate /about
            const nextChar = currentPath.substring(linkPath.length, linkPath.length + 1);
            if (nextChar === '' || nextChar === '/') {
                link.classList.add('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
});