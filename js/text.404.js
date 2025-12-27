document.addEventListener('DOMContentLoaded', () => {
    const glitch = document.querySelector('.glitch');
    if (glitch) {
        const text = glitch.dataset.text;
        glitch.textContent = text;
    }
});
