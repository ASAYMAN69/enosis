const API_URL = 'https://getall.asayman669.workers.dev/';

// Store preloaded images to prevent garbage collection
const preloadedImages = new Set();

const preLoadImages = (imageUrls) => {
    imageUrls.forEach(url => {
        if (!preloadedImages.has(url)) { // Avoid preloading duplicates
            const img = new Image();
            img.src = url;
            // Optionally, handle onload/onerror events if needed for more complex scenarios
            img.onload = () => console.log('Preloaded:', url);
            img.onerror = (e) => console.warn('Failed to preload:', url, e);
            preloadedImages.add(url);
        }
    });
};

const createPropertyCard = (project) => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.dataset.category = project.status.toLowerCase();
    card.dataset.projectId = project.id;

    const badgeClass = `badge-${project.status.toLowerCase()}`;
    const story = project.story ? project.story : 'N/A';
    const total_unit = project.total_unit ? project.total_unit : 'N/A';
    const parking_count = project.parking_count ? project.parking_count : 'N/A';
    const sqft = project.sqft ? project.sqft : 'N/A';
    const unit_per_floor = project.unit_per_floor ? project.unit_per_floor : 'N/A';
    const land_area = project.land_area ? project.land_area : 'N/A';

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
                        <i class="fas fa-building"></i> ${story} Stories
                    </div>
                    <div class="feature">
                        <i class="fas fa-th"></i> ${total_unit} Units
                    </div>
                    <div class="feature">
                        <i class="fas fa-car"></i> ${parking_count} Parking
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
                    <div class="stat-value">${sqft}</div>
                    <div class="stat-label">Sqft</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${unit_per_floor}</div>
                    <div class="stat-label">Units/Floor</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${land_area}</div>
                    <div class="stat-label">Land Area</div>
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

    const modalCloseBtn = projectModal.querySelector('.modal-close-btn');
    const modalMainImageContainer = projectModal.querySelector('.modal-main-image'); // This is the viewport
    const modalImageSlider = projectModal.querySelector('.modal-image-slider'); // This is the container that slides
    const modalThumbnails = projectModal.querySelector('#modalThumbnails');
    const modalProjectTitle = projectModal.querySelector('#modalProjectTitle');
    const modalProjectAddress = projectModal.querySelector('#modalProjectAddress');
    const modalProjectStatus = projectModal.querySelector('#modalProjectStatus');
    const modalProjectDescription = projectModal.querySelector('#modalProjectDescription');
    const modalProjectFeatures = projectModal.querySelector('#modalProjectFeatures');
    const prevBtn = projectModal.querySelector('.modal-gallery-nav.prev-btn');
    const nextBtn = projectModal.querySelector('.modal-gallery-nav.next-btn');

    let currentProject = null;
    let currentImageIndex = 0;

    // Swipe variables
    let touchStartX = 0;
    let touchMoveX = 0;
    let isSwiping = false;
    const swipeThreshold = 50; // Minimum pixels for a swipe to be recognized

    const openModal = () => {
        projectModal.style.display = 'flex';
        requestAnimationFrame(() => {
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    };

    const closeModal = () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
        projectModal.addEventListener('transitionend', () => {
            if (!projectModal.classList.contains('active')) {
                projectModal.style.display = 'none';
            }
        }, { once: true });
    };

    const updateSliderPosition = (animate = true) => {
        if (!modalImageSlider) return;
        const offset = -currentImageIndex * 100;
        modalImageSlider.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
        modalImageSlider.style.transform = `translateX(${offset}%)`;

        // Update active thumbnail
        if (modalThumbnails.querySelector('.active')) {
            modalThumbnails.querySelector('.active').classList.remove('active');
        }
        const activeThumbnail = modalThumbnails.children[currentImageIndex];
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
        }
    };

    const showImage = (index) => {
        if (!currentProject || !currentProject.photo || currentProject.photo.length === 0) return;

        currentImageIndex = (index + currentProject.photo.length) % currentProject.photo.length;
        updateSliderPosition();
    };


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

    prevBtn.addEventListener('click', () => {
        showImage(currentImageIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        showImage(currentImageIndex + 1);
    });

    // Add swipe events to the main image container (viewport)
    modalMainImageContainer.addEventListener('touchstart', (e) => {
        if (currentProject.photo.length <= 1) return;
        isSwiping = true;
        touchStartX = e.touches[0].clientX;
        modalImageSlider.style.transition = 'none'; // Disable transition during drag
    });

    modalMainImageContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping || currentProject.photo.length <= 1) return;
        touchMoveX = e.touches[0].clientX;
        const diff = touchMoveX - touchStartX;
        const offset = (-currentImageIndex * modalMainImageContainer.offsetWidth) + diff;
        modalImageSlider.style.transform = `translateX(${offset}px)`;
    });

    modalMainImageContainer.addEventListener('touchend', () => {
        if (!isSwiping || currentProject.photo.length <= 1) {
            isSwiping = false;
            return;
        }
        isSwiping = false;

        const diff = touchMoveX - touchStartX;
        const imageWidth = modalMainImageContainer.offsetWidth; // Get current width of the container

        if (diff > swipeThreshold) { // Swiped right (previous)
            showImage(currentImageIndex - 1);
        } else if (diff < -swipeThreshold) { // Swiped left (next)
            showImage(currentImageIndex + 1);
        } else { // Not a strong enough swipe, snap back
            updateSliderPosition(); // Snap back to current image with animation
        }
        touchStartX = 0;
        touchMoveX = 0;
    });

    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.projectId;
            currentProject = projectsData.find(p => p.id == projectId);

            if (currentProject) {
                // Populate Modal with project data
                modalProjectTitle.textContent = currentProject.projectName;
                modalProjectAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentProject.location}`;
                modalProjectDescription.textContent = currentProject.description;
                
                // Status Badge
                modalProjectStatus.textContent = currentProject.status;
                modalProjectStatus.className = `property-badge badge-${currentProject.status.toLowerCase()}`;

                // Image Gallery
                modalImageSlider.innerHTML = ''; // Clear previous images
                modalThumbnails.innerHTML = '';
                if (currentProject.photo && currentProject.photo.length > 0) {
                    currentImageIndex = 0; // Reset index on modal open
                    currentProject.photo.forEach((photoUrl, index) => {
                        const img = document.createElement('img');
                        img.src = photoUrl;
                        img.alt = `${currentProject.projectName} - Image ${index + 1}`;
                        modalImageSlider.appendChild(img); // Add image to the slider

                        const thumb = document.createElement('img');
                        thumb.src = photoUrl;
                        thumb.alt = `Thumbnail ${index + 1}`;
                        thumb.classList.add('modal-thumbnail');
                        thumb.addEventListener('click', () => {
                            showImage(index); // Use showImage for thumbnail click
                        });
                        modalThumbnails.appendChild(thumb);
                    });
                    // Set initial slider position without animation
                    updateSliderPosition(false);
                } else {
                    const img = document.createElement('img');
                    img.src = 'https://picsum.photos/seed/default/800/600';
                    img.alt = 'No Image Available';
                    modalImageSlider.appendChild(img);
                }
                
                // Show/hide navigation buttons based on image count
                if (currentProject.photo && currentProject.photo.length > 1) {
                    prevBtn.style.display = 'flex';
                    nextBtn.style.display = 'flex';
                } else {
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';
                }

                // Key Features
                modalProjectFeatures.innerHTML = '';
                const features = {
                    "Stories": { value: currentProject.story, icon: 'fa-building' },
                    "Total Units": { value: currentProject.total_unit, icon: 'fa-th' },
                    "Units/Floor": { value: currentProject.unit_per_floor, icon: 'fa-layer-group' },
                    "Land Area": { value: currentProject.land_area, icon: 'fa-ruler-combined' },
                    "Area (sqft)": { value: currentProject.sqft, icon: 'fa-vector-square' },
                    "Parking": { value: currentProject.parking_count, icon: 'fa-car' }
                };

                for (const [key, { value, icon }] of Object.entries(features)) {
                    if (value) {
                        const featureItem = document.createElement('div');
                        featureItem.classList.add('feature-item');
                        featureItem.innerHTML = `
                            <i class="fas ${icon}"></i>
                            <div class="feature-text">
                                <strong>${key}</strong>
                                <p>${value}</p>
                            </div>
                        `;
                        modalProjectFeatures.appendChild(featureItem);
                    }
                }
                
                openModal();
            }
        });
    });
};

const fetchProjects = async () => {
    try {
        const response = await fetch(API_URL);
        const projects = await response.json();

        // Collect all image URLs for pre-loading
        const allImageUrls = new Set();
        projects.forEach(project => {
            if (project.photo && project.photo.length > 0) {
                project.photo.forEach(url => allImageUrls.add(url));
            }
        });
        preLoadImages(Array.from(allImageUrls)); // Initiate pre-loading

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
