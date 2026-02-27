const API_URL = 'https://getall.asayman669.workers.dev/';

// Store preloaded images to prevent garbage collection
const preloadedImages = new Set();

// Helper function to detect YouTube embed URLs
const isYouTubeEmbed = (url) => {
    return url && (
        url.includes('youtube.com/embed/') ||
        url.includes('youtu.be/') ||
        (url.includes('youtube.com') && url.includes('v='))
    );
};

// Helper function to convert YouTube URL to embed format if needed
const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) {
        return url;
    }
    // Extract video ID and convert to embed format
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
};

const preLoadImages = (imageUrls) => {
    imageUrls.forEach(url => {
        // Skip YouTube URLs for preloading
        if (isYouTubeEmbed(url)) {
            return;
        }
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
    const modalViewFullBtn = projectModal.querySelector('.modal-view-full-btn');
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

    // Full Screen Viewer Elements
    const fullScreenViewer = document.getElementById('fullScreenViewer');
    const fullScreenImage = document.getElementById('fullScreenImage');
    const viewerCloseBtn = document.getElementById('viewerCloseBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');

    let currentProject = null;
    let currentImageIndex = 0;
    let currentVideoIframe = null; // Track the currently playing video iframe

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
        // Pause any playing video when closing modal
        pauseCurrentVideo();
        // Close full-screen viewer if open
        if (fullScreenViewer.classList.contains('active')) {
            closeFullScreenViewer();
        }
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

        // Pause current video if exists
        pauseCurrentVideo();

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

        // Update view full button visibility (only for images)
        updateViewFullButton();
    };

    const pauseCurrentVideo = () => {
        if (currentVideoIframe) {
            const videoSrc = currentVideoIframe.src;
            currentVideoIframe.src = ''; // Pause the video by removing source
            currentVideoIframe.src = videoSrc; // Restore source
            currentVideoIframe = null;
        }
    };

    // Full Screen Viewer Variables
    let viewerScale = 1;
    let viewerTranslateX = 0;
    let viewerTranslateY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialViewerTranslateX = 0;
    let initialViewerTranslateY = 0;
    let pinchStartDistance = 0;
    let initialPinchScale = 1;

    const updateViewFullButton = () => {
        if (!currentProject || !currentProject.photo || currentProject.photo.length === 0) {
            modalViewFullBtn?.classList.add('hidden');
            return;
        }
        const isCurrentItemVideo = isYouTubeEmbed(currentProject.photo[currentImageIndex]);
        if (isCurrentItemVideo) {
            modalViewFullBtn?.classList.add('hidden');
        } else {
            // Only show on mobile
            if (window.innerWidth <= 768) {
                modalViewFullBtn?.classList.remove('hidden');
            } else {
                modalViewFullBtn?.classList.add('hidden');
            }
        }
    };

    const openFullScreenViewer = () => {
        if (!currentProject || !currentProject.photo || currentProject.photo.length === 0) return;
        const currentUrl = currentProject.photo[currentImageIndex];
        if (isYouTubeEmbed(currentUrl)) return; // Don't open viewer for videos

        fullScreenImage.src = currentUrl;
        fullScreenViewer.classList.add('active');

        // Request full screen
        if (fullScreenViewer.requestFullscreen) {
            fullScreenViewer.requestFullscreen();
        } else if (fullScreenViewer.webkitRequestFullscreen) {
            fullScreenViewer.webkitRequestFullscreen();
        } else if (fullScreenViewer.msRequestFullscreen) {
            fullScreenViewer.msRequestFullscreen();
        }

        // Reset zoom and position
        viewerScale = 1;
        viewerTranslateX = 0;
        viewerTranslateY = 0;
        updateViewerTransform();
        document.body.style.overflow = 'hidden';
    };

    const closeFullScreenViewer = () => {
        fullScreenViewer.classList.remove('active');
        fullScreenImage.src = '';
        document.body.style.overflow = '';

        // Exit full screen if active
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        // Reset zoom and position
        viewerScale = 1;
        viewerTranslateX = 0;
        viewerTranslateY = 0;
    };

    const updateViewerTransform = () => {
        fullScreenImage.style.transform = `translate(${viewerTranslateX}px, ${viewerTranslateY}px) scale(${viewerScale})`;
        fullScreenImage.style.webkitTransform = `translate(${viewerTranslateX}px, ${viewerTranslateY}px) scale(${viewerScale})`;
    };

    const zoomIn = () => {
        viewerScale = Math.min(viewerScale + 0.5, 5);
        updateViewerTransform();
    };

    const zoomOut = () => {
        if (viewerScale > 1) {
            viewerScale = Math.max(viewerScale - 0.5, 1);
            // Reset position when zooming back to 1
            if (viewerScale === 1) {
                viewerTranslateX = 0;
                viewerTranslateY = 0;
            }
            updateViewerTransform();
        }
    };

    const showImage = (index) => {
        if (!currentProject || !currentProject.photo || currentProject.photo.length === 0) return;

        // Pause current video before moving
        pauseCurrentVideo();

        currentImageIndex = (index + currentProject.photo.length) % currentProject.photo.length;
        updateSliderPosition();
        updateViewFullButton();
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
        if (event.key === 'Escape' && fullScreenViewer.classList.contains('active')) {
            closeFullScreenViewer();
        }
    });

    // View Full Button Event (only mobile)
    modalViewFullBtn.addEventListener('click', openFullScreenViewer);

    // Full Screen Viewer Events
    viewerCloseBtn.addEventListener('click', closeFullScreenViewer);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);

    // Full screen change detection
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && fullScreenViewer.classList.contains('active')) {
            closeFullScreenViewer();
        }
    });

    document.addEventListener('webkitfullscreenchange', () => {
        if (!document.webkitFullscreenElement && fullScreenViewer.classList.contains('active')) {
            closeFullScreenViewer();
        }
    });

    // Double-click to toggle zoom
    fullScreenViewer.addEventListener('dblclick', () => {
        if (viewerScale === 1) {
            zoomIn();
        } else {
            viewerScale = 1;
            viewerTranslateX = 0;
            viewerTranslateY = 0;
            updateViewerTransform();
        }
    });

    // Mouse drag for panning (desktop)
    fullScreenViewer.addEventListener('mousedown', (e) => {
        if (viewerScale > 1 && e.target === fullScreenImage) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            initialViewerTranslateX = viewerTranslateX;
            initialViewerTranslateY = viewerTranslateY;
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            viewerTranslateX = initialViewerTranslateX + deltaX;
            viewerTranslateY = initialViewerTranslateY + deltaY;
            updateViewerTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events for mobile (pan and pinch-to-zoom)
    let touches = [];

    fullScreenViewer.addEventListener('touchstart', (e) => {
        if (e.target !== fullScreenImage) return;

        touches = Array.from(e.touches);
        if (touches.length === 2) {
            // Pinch start
            pinchStartDistance = Math.hypot(
                touches[1].clientX - touches[0].clientX,
                touches[1].clientY - touches[0].clientY
            );
            initialPinchScale = viewerScale;
        } else if (touches.length === 1 && viewerScale > 1) {
            // Pan start
            isDragging = true;
            dragStartX = touches[0].clientX;
            dragStartY = touches[0].clientY;
            initialViewerTranslateX = viewerTranslateX;
            initialViewerTranslateY = viewerTranslateY;
        }
        e.preventDefault();
    }, { passive: false });

    fullScreenViewer.addEventListener('touchmove', (e) => {
        if (e.target !== fullScreenImage) return;

        const newTouches = Array.from(e.touches);

        if (newTouches.length === 2 && touches.length === 2) {
            // Pinch zoom
            const currentDistance = Math.hypot(
                newTouches[1].clientX - newTouches[0].clientX,
                newTouches[1].clientY - newTouches[0].clientY
            );
            const scaleChange = currentDistance / pinchStartDistance;
            viewerScale = Math.min(Math.max(initialPinchScale * scaleChange, 1), 5);
            updateViewerTransform();
        } else if (newTouches.length === 1 && isDragging && viewerScale > 1) {
            // Pan
            const deltaX = newTouches[0].clientX - dragStartX;
            const deltaY = newTouches[0].clientY - dragStartY;
            viewerTranslateX = initialViewerTranslateX + deltaX;
            viewerTranslateY = initialViewerTranslateY + deltaY;
            updateViewerTransform();
        }

        touches = newTouches;
        e.preventDefault();
    }, { passive: false });

    fullScreenViewer.addEventListener('touchend', (e) => {
        if (e.target !== fullScreenImage) return;

        touches = Array.from(e.touches);

        if (touches.length === 0) {
            isDragging = false;
        }

        e.preventDefault();
    }, { passive: false });

    // Wheel zoom for desktop
    fullScreenViewer.addEventListener('wheel', (e) => {
        if (e.target === fullScreenImage) {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }
    }, { passive: false });

    // Handle window resize for view full button visibility
    window.addEventListener('resize', () => {
        updateViewFullButton();
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

        // Pause current video when swiping
        pauseCurrentVideo();

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
                currentVideoIframe = null; // Reset video reference

                if (currentProject.photo && currentProject.photo.length > 0) {
                    currentImageIndex = 0; // Reset index on modal open
                    currentProject.photo.forEach((photoUrl, index) => {
                        const isVideo = isYouTubeEmbed(photoUrl);

                        if (isVideo) {
                            // Create iframe for YouTube video
                            const embedUrl = getEmbedUrl(photoUrl);
                            const iframe = document.createElement('iframe');
                            iframe.src = embedUrl;
                            iframe.className = 'modal-video-slide';
                            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                            iframe.setAttribute('allowfullscreen', 'true');
                            iframe.setAttribute('frameborder', '0');
                            // Set a data attribute to track if this is the current video
                            iframe.dataset.index = index;

                            // Store reference when this video becomes active
                            iframe.addEventListener('play', () => {
                                currentVideoIframe = iframe;
                            });

                            modalImageSlider.appendChild(iframe);

                            // Thumbnail for video
                            const thumbContainer = document.createElement('div');
                            thumbContainer.className = 'modal-thumbnail video-thumbnail';
                            thumbContainer.innerHTML = `<div class="video-indicator"><i class="fas fa-play-circle"></i></div>`;
                            thumbContainer.addEventListener('click', () => {
                                showImage(index);
                            });
                            modalThumbnails.appendChild(thumbContainer);
                        } else {
                            // Create image element
                            const img = document.createElement('img');
                            img.src = photoUrl;
                            img.alt = `${currentProject.projectName} - Image ${index + 1}`;
                            img.className = 'modal-image-slide';
                            modalImageSlider.appendChild(img); // Add image to the slider

                            const thumb = document.createElement('img');
                            thumb.src = photoUrl;
                            thumb.alt = `Thumbnail ${index + 1}`;
                            thumb.classList.add('modal-thumbnail');
                            thumb.addEventListener('click', () => {
                                showImage(index); // Use showImage for thumbnail click
                            });
                            modalThumbnails.appendChild(thumb);
                        }
                    });
                    // Set initial slider position without animation
                    updateSliderPosition(false);
                } else {
                    const img = document.createElement('img');
                    img.src = 'https://picsum.photos/seed/default/800/600';
                    img.alt = 'No Image Available';
                    img.className = 'modal-image-slide';
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

                updateViewFullButton();
                openModal();
            }
        });
    });
};

const fetchProjects = async () => {
    try {
        const response = await fetch(API_URL);
        const projects = await response.json();

        // Normalize `photo` property to be an array of URLs
        projects.forEach(project => {
            if (typeof project.photo === 'string') {
                if (project.photo.startsWith('[')) {
                    // It's a JSON string array, so parse it
                    try {
                        project.photo = JSON.parse(project.photo);
                    } catch (e) {
                        console.error('Failed to parse photo array:', project.photo, e);
                        project.photo = []; // Set to empty array on parse error
                    }
                } else if (project.photo.trim() !== '') {
                    // It's a single URL string, wrap it in an array
                    project.photo = [project.photo];
                } else {
                    project.photo = [];
                }
            } else if (!project.photo) {
                // It's null, undefined, or some other non-array type
                project.photo = [];
            }
        });

        // Collect all image URLs for pre-loading (skip YouTube videos)
        const allImageUrls = new Set();
        projects.forEach(project => {
            if (project.photo.length > 0) {
                project.photo.forEach(url => {
                    if (!isYouTubeEmbed(url)) {
                        allImageUrls.add(url);
                    }
                });
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
