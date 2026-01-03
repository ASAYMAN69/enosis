const API_URL = 'https://getall.asayman669.workers.dev/';

const createPropertyCard = (project) => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.dataset.category = project.type.toLowerCase();
    card.dataset.projectId = project.id;

    const badgeClass = `badge-${project.type.toLowerCase()}`;
    const bedrooms = project.bedrooms ? project.bedrooms : 'N/A';
    const bathrooms = project.bathrooms ? project.bathrooms : 'N/A';
    const parking = project.parking ? project.parking : 'N/A';
    const sqft = project.sqft ? project.sqft : 'N/A';

    card.innerHTML = `
        <div class="property-badge ${badgeClass}">${project.type}</div>
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
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalProjectImage = document.getElementById('modalProjectImage');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectAddress = document.getElementById('modalProjectAddress');
    const modalProjectDescription = document.getElementById('modalProjectDescription');
    const modalProjectFeatures = document.getElementById('modalProjectFeatures');

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

        const viewDetailsButtons = document.querySelectorAll('.contact-btn');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const projectId = button.dataset.projectId;
                const project = projectsData.find(p => p.id == projectId);

                if (project) {
                    modalProjectImage.src = project.photo[0];
                    modalProjectImage.alt = project.projectName;
                    modalProjectTitle.textContent = project.projectName;
                    modalProjectAddress.textContent = project.location;
                    modalProjectDescription.textContent = project.description;

                    modalProjectFeatures.innerHTML = '';
                    const featureItem = document.createElement('div');
                    featureItem.classList.add('modal-feature-item');
                    featureItem.innerHTML = `<i class="fas fa-info-circle"></i> ${project.type}`;
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
                    const project = projectsData.find(p => p.id == projectId);

                    if (project) {
                        modalProjectImage.src = project.photo[0];
                        modalProjectImage.alt = project.projectName;
                        modalProjectTitle.textContent = project.projectName;
                        modalProjectAddress.textContent = project.location;
                        modalProjectDescription.textContent = project.description;

                        modalProjectFeatures.innerHTML = '';
                        const featureItem = document.createElement('div');
                        featureItem.classList.add('modal-feature-item');
                        featureItem.innerHTML = `<i class="fas fa-info-circle"></i> ${project.type}`;
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
            if (project.type === 'Ongoing') {
                ongoingGrid.appendChild(card);
            } else if (project.type === 'Upcoming') {
                upcomingGrid.appendChild(card);
            } else if (project.type === 'Finished') {
                finishedGrid.appendChild(card);
            }
        });

        setupModalEventListeners(projects);

    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

document.addEventListener('DOMContentLoaded', fetchProjects);
