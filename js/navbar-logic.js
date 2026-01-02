// Navbar Logic

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.getElementById('navbar');

// Hamburger Menu
if (hamburger && navLinks && navbar) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        navbar.classList.toggle('active'); // Toggle active class on navbar
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            navbar.classList.remove('active'); // Remove active class from navbar
        }
    });
}


// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar && window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else if (navbar) {
        navbar.classList.remove('scrolled');
    }
});

// Set active navigation link based on current page
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';

    // If on a 404 page, do not set any link as active
    if (currentPath.includes('404')) {
        navLinks.forEach(link => link.classList.remove('active'));
        return;
    }

    let bestMatch = null;
    let longestMatch = -1;

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').replace(/\/$/, '') || '/';

        if (currentPath.startsWith(linkPath)) {
            if (linkPath.length > longestMatch) {
                longestMatch = linkPath.length;
                bestMatch = link;
            }
        }
    });

    navLinks.forEach(link => link.classList.remove('active'));
    if (bestMatch) {
        bestMatch.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
});
