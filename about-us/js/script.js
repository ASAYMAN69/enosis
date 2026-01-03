// Navbar Logic (from js/navbar-logic.js)
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

// Ensure setActiveNavLink is called on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();

    // Show All/Show Less functionality for Team Members (Adapted from projects/js/see-all.js)
    const teamGridSection = document.querySelector('.team'); // Parent section of team grid
    if (teamGridSection) {
        const teamGrid = teamGridSection.querySelector('.team-grid');
        const teamMembers = Array.from(teamGrid.querySelectorAll('.team-member'));
        const seeAllBtn = teamGridSection.querySelector('.see-all-btn');
        const seeAllContainer = teamGridSection.querySelector('.see-all-container');

        if (teamMembers.length > 3) {
            if (seeAllContainer) {
                seeAllContainer.classList.add('visible'); // Add 'visible' class if needed for styling
            }

            teamMembers.forEach((member, index) => {
                if (index >= 3) { // Hide members from the 4th one onwards
                    member.classList.add('hidden');
                }
            });

            if (seeAllBtn) {
                seeAllBtn.addEventListener('click', () => {
                    if (seeAllBtn.textContent === 'See All') {
                        teamMembers.forEach(member => member.classList.remove('hidden'));
                        seeAllBtn.textContent = 'Show Less';
                    } else {
                        teamMembers.forEach((member, index) => {
                            if (index >= 3) {
                                member.classList.add('hidden');
                            }
                        });
                        seeAllBtn.textContent = 'See All';
                    }
                });
            }
        } else {
            // If there are 3 or fewer team members, hide the see-all-container
            if (seeAllContainer) {
                seeAllContainer.style.display = 'none';
            }
        }
    }

    // Intersection Observer for scroll animations (from root js/script.js)
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
});