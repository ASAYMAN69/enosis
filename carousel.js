document.addEventListener('DOMContentLoaded', () => {
    // Initialize and setup when page loads
    setupCarousel();

    // Setup carousel functionality
    function setupCarousel() {
        const container = document.querySelector('.carousel-container');
        
        // Card data for mobile modal
        const cardData = [
            {
                title: "John Doe",
                subtitle: "Happy Homeowner",
                description: "Working with Enosis was a dream come true. They were professional, transparent, and delivered our home on time. We couldn't be happier!",
                badge: "Client Review"
            },
            {
                title: "Jane Smith",
                subtitle: "Proud Landowner",
                description: "The team at Enosis is top-notch. They listened to our needs and built a home that exceeded our expectations. Highly recommended!",
                badge: "Client Review"
            },
            {
                title: "Mike Johnson",
                subtitle: "Happy Investor",
                description: "From start to finish, the process was seamless. Enosis made our dream home a reality, and we are forever grateful.",
                badge: "Client Review"
            },
            {
                title: "Emily Williams",
                subtitle: "Happy Homeowner",
                description: "Enosis is a name you can trust. Their commitment to quality and customer satisfaction is evident in everything they do.",
                badge: "Client Review"
            }
        ];

        if (!container) return; // Exit if carousel container not found

        container.innerHTML = ''; // Clear existing items

        const animationDuration = 15;
        const delayBetweenCards = animationDuration / cardData.length;

        cardData.forEach((card, index) => {
            const item = document.createElement('div');
            item.className = `carousel-item item-${index + 1}`;
            item.style.animationDuration = `${animationDuration}s`;
            item.style.animationDelay = `-${index * delayBetweenCards}s`;

            item.innerHTML = `
                <img src="https://picsum.photos/seed/client${index + 1}/100/100" alt="${card.title}">
                <div class="card-overlay">
                    <div class="card-title">${card.title}</div>
                    <div class="card-subtitle">${card.subtitle}</div>
                    <div class="card-description">${card.description}</div>
                </div>
            `;
            container.appendChild(item);
        });
        
        const carouselItems = document.querySelectorAll('.carousel-item');

        // Mobile touch detection
        function isTouchDevice() {
            return (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0));
        }
        
        // Show mobile modal
        function showMobileModal(cardIndex) {
            const modal = document.getElementById('mobileModal');
            const data = cardData[cardIndex];
            
            if (modal && data) {
                const modalImage = document.getElementById('modalImage');
                const modalTitle = document.getElementById('modalTitle');
                const modalSubtitle = document.getElementById('modalSubtitle');
                const modalDescription = document.getElementById('modalDescription');
                const modalBadge = document.getElementById('modalBadge');
                
                if (modalImage) modalImage.src = 'https://i.postimg.cc/fT5DRrLB/Screenshot-2025-05-29-154245.png';
                if (modalTitle) modalTitle.textContent = data.title;
                if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
                if (modalDescription) modalDescription.textContent = data.description;
                if (modalBadge) modalBadge.textContent = data.badge;
                
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Hide mobile modal
        function hideMobileModal() {
            const modal = document.getElementById('mobileModal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
        
        // Add hover effects for desktop
        if (!isTouchDevice()) {
            carouselItems.forEach((item, index) => {
                item.addEventListener('mouseenter', () => {
                    // Add paused class to container when any card is hovered
                    container.classList.add('paused');
                });
                
                item.addEventListener('mouseleave', () => {
                    // Remove paused class from container when card is no longer hovered
                    container.classList.remove('paused');
                });
            });
        }
        
        // Touch/click events for mobile
        carouselItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (isTouchDevice()) {
                    e.preventDefault();
                    showMobileModal(index);
                }
            });
        });
        
        // Modal close events - with null checks
        const modalClose = document.getElementById('modalClose');
        const mobileModal = document.getElementById('mobileModal');
        
        if (modalClose) {
            modalClose.addEventListener('click', hideMobileModal);
        }
        
        if (mobileModal) {
            mobileModal.addEventListener('click', (e) => {
                if (e.target.id === 'mobileModal') {
                    hideMobileModal();
                }
            });
        }
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideMobileModal();
            }
        });
    }
});
