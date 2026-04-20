document.addEventListener('DOMContentLoaded', function() {
    const gridContainers = document.querySelectorAll('.projects-grid-container');

    gridContainers.forEach(container => {
        const grid = container.querySelector('.projects-grid');
        const seeAllContainer = container.querySelector('.see-all-container');

        if (seeAllContainer) {
            seeAllContainer.style.display = 'none';
        }

        const observer = new MutationObserver(() => {
            const cards = Array.from(grid.querySelectorAll('.property-card'));

            cards.forEach(card => {
                card.classList.remove('hidden');
            });
        });

        observer.observe(grid, { childList: true });
    });
});