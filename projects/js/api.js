const API_URL = 'https://getall.asayman669.workers.dev/';

const createPropertyCard = (project) => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.dataset.category = project.status.toLowerCase();
    card.dataset.projectId = project.id;

    const badgeClass = `badge-${project.status.toLowerCase()}`;
    const bedrooms = project.bedrooms ? project.bedrooms : 'N/A';
    const bathrooms = project.bathrooms ? project.bathrooms : 'N/A';
    const parking = project.parking ? project.parking : 'N/A';
    const sqft = project.sqft ? project.sqft : 'N/A';

    card.innerHTML = `
        <div class="property-badge ${badgeClass}">${project.status}</div>
        <div class="card-image">
            <img src="${project.photo.length > 0 ? project.photo[0] : 'https://picsum.photos/seed/default/800/600'}" alt="${project.projectName}">
        </div>
        <div class="card-content">
            <div>
                <h3>${project.projectName}</h3>
                <div class="property-price">Price on Request</div>
                <div class="property-address">${project.location}</div>
                <div class="property-features">
                    <div class="feature">
                        <i class="fas fa-building"></i> Residential
                    </div>
                    <div class="feature">
                        <i class="fas fa-bed"></i> ${bedrooms} Beds
                    </div>
                    <div class="feature">
                        <i class="fas fa-bath"></i> ${bathrooms} Baths
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <div class="agent-info">
                    <div class="agent-avatar">EA</div>
                    <div class="agent-name">${project.projectName}</div>
                </div>
            </div>
        </div>
        <div class="card-overlay">
            <h3 class="overlay-title">${project.projectName}</h3>
            <p class="property-description">${project.description}</p>
            <div class="property-stats">
                <div class="stat">
                    <div class="stat-value">${bedrooms}</div>
                    <div class="stat-label">Bedrooms</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${bathrooms}</div>
                    <div class="stat-label">Bathrooms</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${parking}</div>
                    <div class="stat-label">Parking</div>
                </div>
            </div>
            <button class="contact-btn" data-project-id="${project.id}">View Details</button>
        </div>
    `;
    return card;
};

const setupModalEventListeners = (projectsData) => {
    const projectModal = document.getElementById('projectModal');
    if (!projectModal) {
        return; // Modal not on this page
    }
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalSlidesContainer = document.getElementById('modalSlidesContainer');
    const modalPrevBtn = document.querySelector('.modal-prev-btn');
    const modalNextBtn = document.querySelector('.modal-next-btn');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectAddress = document.getElementById('modalProjectAddress');
    const modalProjectDescription = document.getElementById('modalProjectDescription');
    const modalProjectFeatures = document.getElementById('modalProjectFeatures');

    let currentProject = null;
    let currentSlideIndex = 0;
    let totalSlides = 0;

    const updateSlide = () => {
        if (modalSlidesContainer) {
            modalSlidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        }
    };

    const nextSlide = () => {
        if (totalSlides > 1) {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            updateSlide();
        }
    };

    const prevSlide = () => {
        if (totalSlides > 1) {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            updateSlide();
        }
    };
    
    if (projectModal && modalCloseBtn) {
        function openModal() {
            projectModal.style.display = 'flex';
            requestAnimationFrame(() => {
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        function closeModal() {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        projectModal.addEventListener('transitionend', () => {
            if (!projectModal.classList.contains('active')) {
                projectModal.style.display = 'none';
            }
        });
        
        modalCloseBtn.addEventListener('click', closeModal);
        projectModal.addEventListener('click', (event) => {
            if (event.target === projectModal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && projectModal.classList.contains('active')) {
                closeModal();
            }
        });

        modalPrevBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            prevSlide();
        });

        modalNextBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            nextSlide();
        });

        // Swipe support
        let startX = 0;
        if (modalSlidesContainer) {
            modalSlidesContainer.addEventListener('touchstart', e => {
                startX = e.touches[0].clientX;
            });

            modalSlidesContainer.addEventListener('touchend', e => {
                let endX = e.changedTouches[0].clientX;
                let diff = startX - endX;

                if (diff > 50) nextSlide();
                if (diff < -50) prevSlide();
            });
        }

        const viewDetailsButtons = document.querySelectorAll('.contact-btn');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const projectId = button.dataset.projectId;
                currentProject = projectsData.find(p => p.id == projectId);

                if (currentProject && modalSlidesContainer) {
                    modalSlidesContainer.innerHTML = ''; // Clear previous slides
                    currentSlideIndex = 0;

                    if (currentProject.photo && currentProject.photo.length > 0) {
                        currentProject.photo.forEach(photoUrl => {
                            const slideDiv = document.createElement('div');
                            slideDiv.className = 'modal-slide';
                            const img = document.createElement('img');
                            img.src = photoUrl;
                            img.alt = currentProject.projectName;
                            slideDiv.appendChild(img);
                            modalSlidesContainer.appendChild(slideDiv);
                        });
                        totalSlides = currentProject.photo.length;
                    } else {
                        // Handle case with no photos
                        const slideDiv = document.createElement('div');
                        slideDiv.className = 'modal-slide';
                        const img = document.createElement('img');
                        img.src = 'https://picsum.photos/seed/default/800/600';
                        img.alt = 'No Image Available';
                        slideDiv.appendChild(img);
                        modalSlidesContainer.appendChild(slideDiv);
                        totalSlides = 1;
                    }

                    updateSlide();

                    modalProjectTitle.textContent = currentProject.projectName;
                    modalProjectAddress.textContent = currentProject.location;
                    modalProjectDescription.textContent = currentProject.description;
                    
                    modalProjectFeatures.innerHTML = '';
                    const featureItem = document.createElement('div');
                    featureItem.classList.add('modal-feature-item');
                    featureItem.innerHTML = `<i class="fas fa-info-circle"></i> ${currentProject.status}`;
                    modalProjectFeatures.appendChild(featureItem);

                    openModal();
                }
            });
        });

        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
            card.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    const projectId = card.dataset.projectId;
                    currentProject = projectsData.find(p => p.id == projectId);

                    if (currentProject && modalSlidesContainer) {
                        modalSlidesContainer.innerHTML = ''; // Clear previous slides
                        currentSlideIndex = 0;
                        
                        if (currentProject.photo && currentProject.photo.length > 0) {
                            currentProject.photo.forEach(photoUrl => {
                                const slideDiv = document.createElement('div');
                                slideDiv.className = 'modal-slide';
                                const img = document.createElement('img');
                                img.src = photoUrl;
                                img.alt = currentProject.projectName;
                                slideDiv.appendChild(img);
                                modalSlidesContainer.appendChild(slideDiv);
                            });
                            totalSlides = currentProject.photo.length;
                        } else {
                            // Handle case with no photos
                            const slideDiv = document.createElement('div');
                            slideDiv.className = 'modal-slide';
                            const img = document.createElement('img');
                            img.src = 'https://picsum.photos/seed/default/800/600';
                            img.alt = 'No Image Available';
                            slideDiv.appendChild(img);
                            modalSlidesContainer.appendChild(slideDiv);
                            totalSlides = 1;
                        }

                        updateSlide();
                        
                        modalProjectTitle.textContent = currentProject.projectName;
                        modalProjectAddress.textContent = currentProject.location;
                        modalProjectDescription.textContent = currentProject.description;

                        modalProjectFeatures.innerHTML = '';
                        const featureItem = document.createElement('div');
                        featureItem.classList.add('modal-feature-item');
                        featureItem.innerHTML = `<i class="fas fa-info-circle"></i> ${currentProject.status}`;
                        modalProjectFeatures.appendChild(featureItem);
                        
                        openModal();
                    }
                }
            });
        });
    }
};

const fetchProjects = async () => {
    try {
        const response = await fetch(API_URL);
        const projects = await response.json();

        const ongoingGrid = document.querySelector('.projects-grid[data-category="ongoing"]');
        const upcomingGrid = document.querySelector('.projects-grid[data-category="upcoming"]');
        const finishedGrid = document.querySelector('.projects-grid[data-category="finished"]');

        ongoingGrid.innerHTML = '';
        upcomingGrid.innerHTML = '';
        finishedGrid.innerHTML = '';

        projects.forEach(project => {
            const card = createPropertyCard(project);
            if (project.status === 'Ongoing') {
                ongoingGrid.appendChild(card);
            } else if (project.status === 'Upcoming') {
                upcomingGrid.appendChild(card);
            } else if (project.status === 'Finished') {
                finishedGrid.appendChild(card);
            }
        });

        setupModalEventListeners(projects);

    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

document.addEventListener('DOMContentLoaded', fetchProjects);
