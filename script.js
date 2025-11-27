let currentSlide = 0;
let autoSlideInterval;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
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
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        link.classList.remove('active'); // Remove active from all links first

        let linkPath = link.getAttribute('href');

        // Handle the "Home" link specifically
        if (linkPath === '/') {
            if (currentPath === '/' || currentPath === '/index.html') {
                link.classList.add('active');
                if (currentPath === '/' || currentPath === '/index.html') {
                    // Prevent navigation if already on home page and clicking home
                    link.addEventListener('click', function(e) {
                        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                            e.preventDefault();
                        }
                    });
                }
            }
        } else if (currentPath.startsWith(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        }
    });
}

// Call setActiveNavLink on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Also call it on hashchange or popstate if needed (for SPA-like behavior)
window.addEventListener('hashchange', setActiveNavLink);
window.addEventListener('popstate', setActiveNavLink);

// Counter animation
const counters = document.querySelectorAll('.stat-number'); // Targeted specifically to hero section
const speed = 50;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const increment = target / speed;
    let count = 0;

    const updateCount = () => {
        count += increment;
        if (count < target) {
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target;
        }
    };
    updateCount();
};

// Intersection Observer for counter animation
const statsObserver = new IntersectionObserver((entries) => { // Renamed for clarity
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            animateCounter(counter);
            statsObserver.unobserve(counter); // Stop observing once animated
        }
    });
}, { threshold: 0.5 }); // Trigger when 50% of the element is visible

counters.forEach(counter => statsObserver.observe(counter));
