document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const isMobile = () => window.innerWidth <= 768;

    // --- State variables ---
    let currentIndex = 0;
    let autoplayTimer = null;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let velocity = 0;
    let animationID = null;
    const initialTrackHTML = track.innerHTML;

    // --- Core Functions ---
    function startAutoplay() {
        stopAutoplay();
        if (!isMobile()) return;
        autoplayTimer = setInterval(() => {
            if (!isDragging) {
                let cardCount = track.children.length;
                currentIndex = (currentIndex + 1) % cardCount;
                moveToCard(currentIndex, true);
            }
        }, 2500);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function moveToCard(index, smooth = false) {
        const card = track.children[index];
        if (!card) return;
        const cardWidth = card.offsetWidth;
        const gap = 20;
        const offset = index * (cardWidth + gap);
        
        currentTranslate = -offset;
        
        if (smooth) {
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            track.style.transition = 'transform 0.3s ease-out';
        }
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    // --- Event Handlers for mobile drag (from ignore.html) ---
    function touchStart(e) {
        if (!isMobile()) return;
        stopAutoplay();
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        prevTranslate = currentTranslate; // Capture position at drag start
        track.classList.add('grabbing');
        track.style.transition = 'none';
        velocity = 0;
        cancelAnimationFrame(animationID);
    }

    function touchMove(e) {
        if (!isDragging || !isMobile()) return;
        e.preventDefault();
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;
        
        // This is the original velocity calculation from ignore.html
        velocity = diff - (currentTranslate - prevTranslate);
        currentTranslate = prevTranslate + diff;
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        if (!isDragging || !isMobile()) return;
        isDragging = false;
        track.classList.remove('grabbing');
        
        const animate = () => {
            if (Math.abs(velocity) > 0.5 && !isDragging) {
                currentTranslate += velocity;
                velocity *= 0.95; // Friction
                track.style.transform = `translateX(${currentTranslate}px)`;
                animationID = requestAnimationFrame(animate);
            } else if (!isDragging) {
                snapToClosest();
            }
        };
        animate();
    }

    function snapToClosest() {
        cancelAnimationFrame(animationID);
        const cardWidth = track.children[0].offsetWidth;
        const gap = 20;
        const cardSpacing = cardWidth + gap;
        
        const index = Math.round(-currentTranslate / cardSpacing);
        currentIndex = Math.max(0, Math.min(index, track.children.length - 1));
        
        moveToCard(currentIndex, true);
        
        setTimeout(startAutoplay, 500);
    }

    // --- Setup and Listeners ---
    function setupCarousel() {
        stopAutoplay();
        cancelAnimationFrame(animationID);
        track.style.transition = 'none';
        track.style.animation = '';

        if (isMobile()) {
            if (track.children.length > 4) {
                track.innerHTML = initialTrackHTML;
            }
            moveToCard(currentIndex);
            startAutoplay();
        } else {
            track.innerHTML = initialTrackHTML;
            const cards = track.querySelectorAll('.testimonial-card');
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                track.appendChild(clone);
            });
            track.style.transform = 'translateX(0)';
        }
    }

    track.addEventListener('mousedown', touchStart);
    track.addEventListener('touchstart', touchStart, { passive: false });
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('touchmove', touchMove, { passive: false });
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('mouseleave', touchEnd);
    track.addEventListener('contextmenu', e => e.preventDefault());

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setupCarousel, 250);
    });

    setupCarousel();
});
