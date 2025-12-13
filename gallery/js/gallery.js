document.addEventListener('DOMContentLoaded', function() {
    // Hero Slideshow
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        showSlide(currentSlide);
        setInterval(nextSlide, 3500); // 2.5s stop + 1s slide
    }

    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const span = document.getElementsByClassName('close')[0];

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.querySelector('img').src;
            captionText.innerHTML = this.querySelector('.gallery-item-overlay').innerHTML;
        });
    });

    if(span) {
        span.onclick = function() {
            modal.style.display = 'none';
        }
    }
    
    if(modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        }
    }

    // Gallery filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Before & After Sliders
    const sliders = document.querySelectorAll('.ba-slider');
    sliders.forEach(slider => {
        const handle = slider.querySelector('.handle');
        const resizeImg = slider.querySelector('.resize-img');

        let isDragging = false;

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const sliderRect = slider.getBoundingClientRect();
            let newWidth = (e.clientX - sliderRect.left) / sliderRect.width * 100;
            if (newWidth < 0) newWidth = 0;
            if (newWidth > 100) newWidth = 100;

            resizeImg.style.width = `${newWidth}%`;
            handle.style.left = `${newWidth}%`;
        };

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault(); // Prevent default drag behavior
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        document.addEventListener('mousemove', onMouseMove);

        // Touch events for mobile
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault(); // Prevent scrolling while dragging
        }, { passive: false });
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const sliderRect = slider.getBoundingClientRect();
            let newWidth = (e.touches[0].clientX - sliderRect.left) / sliderRect.width * 100;
            if (newWidth < 0) newWidth = 0;
            if (newWidth > 100) newWidth = 100;

            resizeImg.style.width = `${newWidth}%`;
            handle.style.left = `${newWidth}%`;
        }, { passive: false });
    });
});
