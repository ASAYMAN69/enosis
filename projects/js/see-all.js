document.addEventListener('DOMContentLoaded', function() {
    const gridContainers = document.querySelectorAll('.projects-grid-container');

    gridContainers.forEach(container => {
        const grid = container.querySelector('.projects-grid');
        const cards = Array.from(grid.querySelectorAll('.property-card'));
        const seeAllBtn = container.querySelector('.see-all-btn');
        const seeAllContainer = container.querySelector('.see-all-container');

        if (cards.length > 3) {
            seeAllContainer.classList.add('visible');
            let hiddenCount = cards.length - 3;

            cards.forEach((card, index) => {
                if (index >= 3) {
                    card.classList.add('hidden');
                }
            });

            seeAllBtn.addEventListener('click', () => {
                if (seeAllBtn.textContent === 'See All') {
                    const hiddenCards = cards.filter(card => card.classList.contains('hidden'));
                    hiddenCards.slice(0, 3).forEach(card => {
                        card.classList.remove('hidden');
                    });

                    if (hiddenCards.length <= 3) {
                        seeAllBtn.textContent = 'Hide All';
                    }
                } else {
                    cards.forEach((card, index) => {
                        if (index >= 3) {
                            card.classList.add('hidden');
                        }
                    });
                    seeAllBtn.textContent = 'See All';
                }
            });
        }
    });
});
