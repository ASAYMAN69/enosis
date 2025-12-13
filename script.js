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
            counter.innerText = Math.ceil(count) + '+';
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target + '+';
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
}, { threshold: 0.1 }); // Trigger when 50% of the element is visible

counters.forEach(counter => statsObserver.observe(counter));

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();

    if (document.getElementById('myChart')) {
        // Hardcoded data values
        const initialData = [12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 50];
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        let currentData = [...initialData];
        
        // Chart configuration
        const ctx = document.getElementById('myChart').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 180, 219, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 180, 219, 0.1)');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Performance Metrics',
                    data: currentData,
                    backgroundColor: gradient,
                    borderColor: '#00b4db',
                    borderWidth: 3,
                    pointBackgroundColor: '#00b4db',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#fff',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#00b4db',
                        bodyColor: '#fff',
                        borderColor: '#00b4db',
                        borderWidth: 1,
                        cornerRadius: 10,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });
    }
});