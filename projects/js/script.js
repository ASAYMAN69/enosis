const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 0) {
    let currentSlide = 0;
    let autoSlideInterval;

    function changeSlide(direction) {
        const totalSlides = slides.length;
        
        slides[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        
        slides[currentSlide].classList.add('active');
        
        resetAutoSlide();
    }

    function autoSlide() {
        changeSlide(1);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(autoSlide, 3000);
    }

    // Start auto-sliding
    autoSlideInterval = setInterval(autoSlide, 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Add parallax effect to hero
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     if (hero && scrolled < hero.offsetHeight) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hamburger Menu

const hamburger = document.querySelector('.hamburger');

const navLinks = document.querySelector('.nav-links');



hamburger.addEventListener('click', () => {



    hamburger.classList.toggle('active');



    navLinks.classList.toggle('active');



});







document.addEventListener('click', (e) => {



    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {



        hamburger.classList.remove('active');



        navLinks.classList.remove('active');



    }



});

// Set active navigation link based on current page
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';

    let bestMatch = null;
    let longestMatch = -1;

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').replace(/\/$/, '') || '/';

        if (currentPath.startsWith(linkPath)) {
            if (linkPath.length > longestMatch) {
                longestMatch = linkPath.length;
                bestMatch = link;
            }
        }
    });

    navLinks.forEach(link => link.classList.remove('active'));
    if (bestMatch) {
        bestMatch.classList.add('active');
    }
}

// Counter animation
const counters = document.querySelectorAll('.stat-number'); // Targeted specifically to hero section
const speed = 50;

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const increment = target / speed;
    let count = 0;

    const updateCount = () => {
        count += increment;
        if (count < target) {
            counter.innerText = Math.ceil(count) + '+';
            setTimeout(updateCount, 10);
        } else {
            counter.innerText = target + '+';
        }
    };
    updateCount();
};

// Intersection Observer for counter animation
const statsObserver = new IntersectionObserver((entries) => { // Renamed for clarity
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            animateCounter(counter);
            statsObserver.unobserve(counter); // Stop observing once animated
        }
    });
}, { threshold: 0.1 }); // Trigger when 50% of the element is visible

counters.forEach(counter => statsObserver.observe(counter));

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();

    // Chart.js logic (if it exists on the page)
    if (document.getElementById('myChart')) {
        // ... (Chart.js code from original file - keeping it for safety)
    }

    // Modal and Card Logic
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = projectModal ? projectModal.querySelector('.modal-close-btn') : null;
    const propertyCards = document.querySelectorAll('.property-card');
    
    // Modal content elements
    const modalProjectImage = document.getElementById('modalProjectImage');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectAddress = document.getElementById('modalProjectAddress');
    const modalProjectDescription = document.getElementById('modalProjectDescription');
    const modalProjectFeatures = document.getElementById('modalProjectFeatures');

    // Mock Project Data (replace with real data source if available)
    const projectsData = {
        'project-1': {
            image: 'https://picsum.photos/seed/upcoming1/800/600',
            title: 'Luxury Apartment Complex',
            address: 'Dhaka, Bangladesh',
            description: 'Discover modern living with our upcoming luxury apartment complex, featuring state-of-the-art amenities and prime location. These exclusive residences offer unparalleled comfort and sophistication, perfect for contemporary urban lifestyles. Enjoy spacious layouts, premium finishes, and breathtaking views.',
            features: [
                { icon: 'fas fa-bed', text: '3 Beds' },
                { icon: 'fas fa-bath', text: '3 Baths' },
                { icon: 'fas fa-ruler-combined', text: '1900 sqft' },
                { icon: 'fas fa-car', text: '1 Parking' }
            ]
        },
        'project-2': {
            image: 'https://picsum.photos/seed/upcoming2/800/600',
            title: 'Seaside Condos',
            address: 'Chittagong, Bangladesh',
            description: 'Experience luxurious coastal living with our upcoming seaside condominiums, offering breathtaking views and exclusive amenities. Wake up to the sound of waves and enjoy direct access to pristine beaches. These condos are designed for ultimate relaxation and elegance, providing a perfect getaway or permanent residence.',
            features: [
                { icon: 'fas fa-bed', text: '4 Beds' },
                { icon: 'fas fa-bath', text: '4 Baths' },
                { icon: 'fas fa-ruler-combined', text: '2500 sqft' },
                { icon: 'fas fa-car', text: '2 Parking' }
            ]
        },
        'project-3': {
            image: 'https://picsum.photos/seed/upcoming3/800/600',
            title: 'Eco-Friendly Villas',
            address: 'Sylhet, Bangladesh',
            description: 'Discover sustainable living in our upcoming eco-friendly villas, designed with nature in mind and modern comforts. These villas blend seamlessly with the natural environment, offering energy-efficient designs and serene landscapes. Experience tranquility without compromising on modern amenities and comfort.',
            features: [
                { icon: 'fas fa-bed', text: '2 Beds' },
                { icon: 'fas fa-bath', text: '2 Baths' },
                { icon: 'fas fa-ruler-combined', text: '1500 sqft' },
                { icon: 'fas fa-car', text: '1 Parking' }
            ]
        },
        'project-4': {
            image: 'https://picsum.photos/seed/arpina/800/600',
            title: 'Enosis Arpina',
            address: 'Hatirjheel, Mohanagar, Wapda Road',
            description: 'A prestigious residential project located in the heart of Hatirjheel, offering modern apartments and luxurious amenities. Enosis Arpina is designed for urban dwellers seeking a blend of convenience and high-end living. Enjoy panoramic city views, state-of-the-art facilities, and a vibrant community atmosphere.',
            features: [
                { icon: 'fas fa-building', text: 'Residential' },
                { icon: 'fas fa-bed', text: '3 Beds' },
                { icon: 'fas fa-bath', text: '3 Baths' },
                { icon: 'fas fa-car', text: '1 Parking' }
            ]
        },
        'project-5': {
            image: 'https://picsum.photos/seed/swapno/800/600',
            title: 'Enosis Shwapno Neer',
            address: 'Jolshiri Abashon',
            description: 'A dream home in Jolshiri Abashon, blending modern design with serene surroundings. Enosis Shwapno Neer offers spacious and elegantly designed homes that promise comfort and luxury. Perfect for families looking for a peaceful yet connected lifestyle.',
            features: [
                { icon: 'fas fa-building', text: 'Residential' },
                { icon: 'fas fa-bed', text: '4 Beds' },
                { icon: 'fas fa-bath', text: '3 Baths' },
                { icon: 'fas fa-car', text: '2 Parking' }
            ]
        },
        'project-6': {
            image: 'https://picsum.photos/seed/shorno/800/600',
            title: 'Enosis Shorno Kanon',
            address: 'Jolshiri Abashon',
            description: 'A golden opportunity for serene living in Jolshiri Abashon, offering spacious residential units. Enosis Shorno Kanon provides a harmonious blend of nature and modern architecture. Each unit is crafted to offer maximum comfort and a luxurious living experience.',
            features: [
                { icon: 'fas fa-building', text: 'Residential' },
                { icon: 'fas fa-bed', text: '3 Beds' },
                { icon: 'fas fa-bath', text: '2 Baths' },
                { icon: 'fas fa-car', text: '1 Parking' }
            ]
        },
        'project-7': {
            image: 'https://picsum.photos/seed/windy/800/600',
            title: 'Enosis Windy Ridge',
            address: 'Jolshiri Abashon',
            description: 'Luxurious residential complex with refreshing breezes and modern amenities in Jolshiri Abashon. Enosis Windy Ridge stands out with its unique design and elevated living spaces, offering residents a tranquil retreat from the bustling city life. Enjoy premium facilities and a close-knit community.',
            features: [
                { icon: 'fas fa-building', text: 'Residential' },
                { icon: 'fas fa-bed', text: '5 Beds' },
                { icon: 'fas fa-bath', text: '4 Baths' },
                { icon: 'fas fa-car', text: '2 Parking' }
            ]
        },
        'project-8': {
            image: 'https://picsum.photos/seed/taposhi/800/600',
            title: 'Enosis Taposhi',
            address: 'Kadamtala, Bashabo',
            description: 'A beautifully completed residential complex in Kadamtala, Bashabo, known for its elegant design and comfortable living spaces. Enosis Taposhi offers a perfect blend of modern architecture and functional design, providing residents with a peaceful and convenient lifestyle.',
            features: [
                { icon: 'fas fa-building', text: 'Residential' },
                { icon: 'fas fa-bed', text: '3 Beds' },
                { icon: 'fas fa-bath', text: '2 Baths' },
                { icon: 'fas fa-car', text: '1 Parking' }
            ]
        },
        'project-9': {
            image: 'https://picsum.photos/seed/rubina/800/600',
            title: 'Enosis Rubina',
            address: 'Golam Bazar, Keraniganj',
            description: 'A successful residential project in Golam Bazar, Keraniganj, known for its comfortable family homes and community atmosphere. Enosis Rubina provides well-designed homes with a focus on family-friendly amenities and a welcoming environment, ideal for those seeking a suburban retreat.',
            features: [
                { icon: 'fas fa-building', text: 'Residential' },
                { icon: 'fas fa-bed', text: '4 Beds' },
                { icon: 'fas fa-bath', text: '3 Baths' },
                { icon: 'fas fa-car', text: '2 Parking' }
            ]
        },
        'project-10': {
            image: 'https://picsum.photos/seed/mojibor/800/600',
            title: 'Enosis Mojibor Villa',
            address: 'Cumilla',
            description: 'A custom-built villa in Cumilla, completed as a successful contract project, showcasing bespoke design and quality construction. Enosis Mojibor Villa is a testament to personalized luxury, offering unique architectural elements and high-quality finishes tailored to individual preferences.',
            features: [
                { icon: 'fas fa-file-contract', text: 'Contract' },
                { icon: 'fas fa-bed', text: '5 Beds' },
                { icon: 'fas fa-bath', text: '4 Baths' },
                { icon: 'fas fa-car', text: '2 Parking' }
            ]
        },
        'project-11': {
            image: 'https://picsum.photos/seed/peace/800/600',
            title: 'Peace Point',
            address: 'Kadamtala, Bashabo',
            description: 'A tranquil residential complex in Kadamtala, Bashabo, offering a peaceful living environment and modern amenities. Peace Point is designed to provide residents with a serene and harmonious lifestyle, featuring well-maintained green spaces and essential conveniences.',
            features: [
                { icon: 'fas fa-building', text: 'Residential' },
                { icon: 'fas fa-bed', text: '3 Beds' },
                { icon: 'fas fa-bath', text: '2 Baths' },
                { icon: 'fas fa-car', text: '1 Parking' }
            ]
        }
    };

    function openModalWithProject(projectId) {
        const project = projectsData[projectId];
        if (project && projectModal) {
            if (modalProjectImage) modalProjectImage.src = project.image;
            if (modalProjectImage) modalProjectImage.alt = project.title;
            if (modalProjectTitle) modalProjectTitle.textContent = project.title;
            if (modalProjectAddress) modalProjectAddress.textContent = project.address;
            if (modalProjectDescription) modalProjectDescription.textContent = project.description;
            
            if (modalProjectFeatures) {
                modalProjectFeatures.innerHTML = '';
                project.features.forEach(feature => {
                    const featureItem = document.createElement('div');
                    featureItem.classList.add('modal-feature-item');
                    featureItem.innerHTML = `<i class="${feature.icon}"></i> ${feature.text}`;
                    modalProjectFeatures.appendChild(featureItem);
                });
            }
            
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (projectModal) {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Mobile Card Click to Open Modal
    propertyCards.forEach(card => {
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const projectId = this.dataset.projectId;
                openModalWithProject(projectId);
            }
        });
    });

    // Desktop "View Details" button click to open modal
    const contactBtns = document.querySelectorAll('.card-overlay .contact-btn');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            if (window.innerWidth > 768) {
                event.stopPropagation(); // Stop the card click from firing
                const projectId = btn.dataset.projectId;
                openModalWithProject(projectId);
            }
        });
    });

    // Modal Closing Events
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (projectModal) {
        projectModal.addEventListener('click', (event) => {
            if (event.target === projectModal) {
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            closeModal();
        }
    });
});