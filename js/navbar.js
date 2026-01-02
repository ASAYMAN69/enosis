const menuToggle = document.querySelector('.hamburger');
const navLinks = document.getElementById('nav-links');
const mainContent = document.getElementById('main-content');
const navbar = document.getElementById('navbar');

// Toggle function
const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('active');
    mainContent.classList.toggle('blurred');
    
    // Change hamburger to close icon
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.toggle('active');
};

// Close function
const closeMenu = () => {
    navLinks.classList.remove('active');
    mainContent.classList.remove('blurred');
    
    // Change close icon back to hamburger
    const hamburger = document.querySelector('.hamburger');
    hamburger.classList.remove('active');
};

// 1. Click event for the button
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the window click listener from firing immediately
    toggleMenu();
});

// 2. Click event for the window (Detecting outside clicks)
window.addEventListener('click', (e) => {
    // If the menu is open AND the click was NOT inside the nav container
    if (navLinks.classList.contains('active') && !navbar.contains(e.target)) {
        closeMenu();
    }
});

// 3. Optional: Close menu when a link inside is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});