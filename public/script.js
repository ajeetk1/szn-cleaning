document.addEventListener('DOMContentLoaded', () => {
    fetchContent();
    fetchServices();
    fetchGallery();
    setupForm();
    initMobileMenu();
});

function fetchContent() {
    fetch('/api/content')
        .then(response => response.json())
        .then(data => {
            // Update DOM elements with matching IDs
            data.forEach(item => {
                const element = document.getElementById(item.key);
                if (element) {
                    if (element.tagName === 'IMG') {
                        element.src = item.value;
                    } else if (element.hasAttribute('data-bg')) {
                        // For background images, assume the value is the URL
                        // Handle linear-gradient if it's the CTA strip or similar
                        if (element.classList.contains('cta-strip')) {
                            element.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${item.value}')`;
                        } else {
                            element.style.backgroundImage = `url('${item.value}')`;
                        }
                    } else if (element.tagName === 'A' && element.hasAttribute('data-link')) {
                        element.href = item.value;
                    } else {
                        element.textContent = item.value;
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching content:', error));
}

function fetchServices() {
    fetch('/api/services')
        .then(response => response.json())
        .then(services => {
            const grid = document.getElementById('services-grid');
            grid.innerHTML = ''; // Clear loading state

            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <div class="service-icon">
                        <span class="material-icons-outlined">${service.icon}</span>
                    </div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <a href="#" class="service-link">Read More <span class="material-icons-outlined" style="font-size: 16px;">arrow_forward</span></a>
                `;
                grid.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching services:', error));
}

function fetchGallery() {
    fetch('/api/gallery')
        .then(response => response.json())
        .then(images => {
            const grid = document.getElementById('gallery-grid');
            if (grid) {
                grid.innerHTML = ''; // Clear loading state
                if (images.length === 0) {
                    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No images found.</p>';
                    return;
                }
                images.forEach(image => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `
                        <img src="${image.image_url}" alt="${image.title}">
                        <div class="gallery-overlay">
                            <h3>${image.title}</h3>
                        </div>
                    `;
                    grid.appendChild(item);
                });
            }
        })
        .catch(error => console.error('Error fetching gallery:', error));
}

function setupForm() {
    const form = document.getElementById('quote-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                alert('Quote request sent successfully! We will contact you soon.');
                form.reset();
            })
            .catch(error => {
                console.error('Error sending quote:', error);
                alert('Something went wrong. Please try again.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Open menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.classList.add('menu-open');
        });
    }

    // Close menu function
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    // Close on close button click
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    // Close on backdrop click
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', closeMenu);
    }

    // Close on navigation link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}
