document.addEventListener('DOMContentLoaded', function() {
    const slideshow = document.querySelector('.interiors-slideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.interiors-slide');
        let currentSlide = 0;
        let slideInterval;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        }

        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        slideshow.addEventListener('mouseenter', stopSlideshow);
        slideshow.addEventListener('mouseleave', startSlideshow);

        startSlideshow();
    }
});
