## Gemini Changes Log

### Session: 2025-11-17

- **`carousel.js`**: Replaced the entire file with the script from `ignore.html` to implement a physics-based touch carousel for mobile devices.
- **`carousel.css`**: Updated the mobile styles for the carousel to match the new implementation, specifically adjusting the padding to center the cards correctly on mobile.
- **`script.js`**: Removed the old, conflicting "Reviews Carousel" logic which was causing a TypeError.
- **`index.html`**: Added a `<script>` tag for `carousel.js` to load the new carousel functionality.
- **`GEMINI.md`**: Updated the log with the latest changes.
- **`carousel.css`**: Increased the speed of the desktop carousel by changing `animation-duration` to `15s`.
- **`responsive.css`**: Added `z-index: 1001` to `.nav-links` to fix the mobile sidebar button.
- **`hero.css`**: Made the hero buttons sticky within the hero section and removed `overflow: hidden` from the hero section.
- **`script.js`**: Disabled the parallax effect on the hero section to allow for sticky positioning.
- **Reverted previous changes**: Removed the globally sticky CTA button and associated CSS and JavaScript.
- **`hero.css`**: Added `overflow-x: hidden` to the `.hero` section to prevent horizontal overflow.
- **`global.css`**: Changed `overflow-x: hidden` to `overflow-x: clip` on the `body` to prevent horizontal scrolling.
- **`hero.css`**: Added `overflow-y: hidden` to the `.hero` section to remove the vertical scrollbar.