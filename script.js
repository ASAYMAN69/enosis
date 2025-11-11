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
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

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

// Reviews Carousel

const reviewsCarousel = document.querySelector('.reviews-carousel');

const reviewCards = Array.from(reviewsCarousel.querySelectorAll('.review-card'));

const leftArrow = document.querySelector('.review-arrow.left');

const rightArrow = document.querySelector('.review-arrow.right');

let currentReview = 0;

let reviewInterval;



function showReview(index) {

    const offset = -index * 100;

    reviewsCarousel.style.transform = `translateX(${offset}%)`;

}



function nextReview() {

    currentReview = (currentReview + 1) % reviewCards.length;

    showReview(currentReview);

}



function prevReview() {

    currentReview = (currentReview - 1 + reviewCards.length) % reviewCards.length;

    showReview(currentReview);

}



function startReviewCarousel() {

    reviewInterval = setInterval(nextReview, 3000);

}



function stopReviewCarousel() {

    clearInterval(reviewInterval);

}



if (window.innerWidth <= 768) {

    leftArrow.addEventListener('click', () => {

        stopReviewCarousel();

        prevReview();

        startReviewCarousel();

    });



    rightArrow.addEventListener('click', () => {

        stopReviewCarousel();

        nextReview();

        startReviewCarousel();

    });



    startReviewCarousel();

} else {

    // Desktop carousel logic (currently disabled)

    // To re-enable, add the animation back to reviews.css

    // and the card cloning logic here.

    const reviewsContainer = document.querySelector('.reviews');

    reviewsContainer.style.overflow = 'hidden';

    const allCards = reviewsCarousel.querySelectorAll('.review-card');

    allCards.forEach(card => {

        const clone = card.cloneNode(true);

        reviewsCarousel.appendChild(clone);

    });

    reviewsCarousel.style.animation = 'carousel-slide 20s linear infinite';

}



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
