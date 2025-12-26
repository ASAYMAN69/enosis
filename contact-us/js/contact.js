document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.contact-hero');

    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;
            
            // Calculate a value between 0 and 1 based on how much of the hero is scrolled
            const scrollFraction = Math.min(scrollY / (heroHeight * 0.5), 1);
            
            // Adjust the background position based on the scroll.
            // We'll move it along the x-axis.
            const backgroundPositionX = 50 + (scrollFraction * 50); // Move from 50% to 100%
            
            hero.style.backgroundPosition = `${backgroundPositionX}% 50%`;
        });
    }
});

// Function to adjust body padding-top based on navbar height
function adjustBodyPadding() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        document.body.style.paddingTop = navbar.offsetHeight + 'px';
    }
}

// Call on load and resize
window.addEventListener('load', adjustBodyPadding);
window.addEventListener('resize', adjustBodyPadding);

// Also call on scroll to account for the 'scrolled' class, although it doesn't change the height by much.
// It's safer to ensure the padding is always correct.
window.addEventListener('scroll', adjustBodyPadding);

