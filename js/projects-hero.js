document.addEventListener('DOMContentLoaded', function() {
    loadRandomProjectImages();
});

async function loadRandomProjectImages() {
    const apiURL = 'https://getall.asayman669.workers.dev/';
    const statusMapping = {
        'upcoming': 'Upcoming',
        'ongoing': 'Ongoing',
        'finished': 'Finished'
    };
    const fallbackImages = {
        'upcoming': 'https://picsum.photos/seed/project1/800/600',
        'ongoing': 'https://picsum.photos/seed/project2/800/600',
        'finished': 'https://picsum.photos/seed/project3/800/600'
    };

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('API fetch failed');
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');

        for (const [category, status] of Object.entries(statusMapping)) {
            const projectCard = document.querySelector(`.project-card[data-category="${category}"] .project-card-bg`);
            if (!projectCard) continue;

            try {
                const projectsWithStatus = data.filter(project => {
                    const projectStatus = project.status;
                    if (!projectStatus) return false;
                    return projectStatus.toLowerCase() === status.toLowerCase();
                });

                if (projectsWithStatus.length === 0) {
                    projectCard.style.backgroundImage = `url('${fallbackImages[category]}')`;
                    continue;
                }

                const randomProject = projectsWithStatus[Math.floor(Math.random() * projectsWithStatus.length)];
                
                let photos = [];
                try {
                    photos = JSON.parse(randomProject.photo);
                } catch (e) {
                    console.error('Failed to parse photo array:', e);
                    projectCard.style.backgroundImage = `url('${fallbackImages[category]}')`;
                    continue;
                }

                if (!Array.isArray(photos) || photos.length === 0) {
                    projectCard.style.backgroundImage = `url('${fallbackImages[category]}')`;
                    continue;
                }

                const imagePhotos = photos.filter(photo => {
                    if (typeof photo !== 'string') return false;
                    return photo.includes('imagecdn.enosisltd.com');
                });

                if (imagePhotos.length === 0) {
                    projectCard.style.backgroundImage = `url('${fallbackImages[category]}')`;
                    continue;
                }

                const randomImage = imagePhotos[Math.floor(Math.random() * imagePhotos.length)];

                projectCard.style.backgroundImage = `url('${randomImage}')`;
            } catch (error) {
                console.error(`Error loading image for ${category}:`, error);
                projectCard.style.backgroundImage = `url('${fallbackImages[category]}')`;
            }
        }
    } catch (error) {
        console.error('Error loading project images:', error);
        for (const category of Object.keys(statusMapping)) {
            const projectCard = document.querySelector(`.project-card[data-category="${category}"] .project-card-bg`);
            if (projectCard) {
                projectCard.style.backgroundImage = `url('${fallbackImages[category]}')`;
            }
        }
    }
}
