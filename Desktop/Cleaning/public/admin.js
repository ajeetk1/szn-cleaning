document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadContent();
    loadServices();
    loadGallery();
    loadBookings();
    handleNavigation();
});

// Keep a map of originally loaded content to avoid overwriting unchanged fields
const originalContentMap = {};

async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        if (!data.authenticated) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'login.html';
    }
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}


function handleNavigation() {
    const tabs = document.querySelectorAll('.sidebar nav a[data-tab]');

    // Function to switch tab based on hash
    const switchTab = () => {
        let hash = window.location.hash.slice(1);
        if (!hash || hash === '') hash = 'home'; // Default to home

        // Remove active class from all tabs and content
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Activate tab and content matching hash
        const activeTab = document.querySelector(`.sidebar nav a[data-tab="${hash}"]`);
        const activeContent = document.getElementById(hash);

        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    };

    // Listen for hash changes
    window.addEventListener('hashchange', switchTab);

    // Initial load
    switchTab();
}

// Content Management
async function loadContent() {
    try {
        const response = await fetch('/api/content');
        const content = await response.json();

        // Populate all inputs that have an ID matching a content key
        content.forEach(item => {
            const element = document.getElementById(item.key);
            if (element) {
                element.value = item.value;
                // store original value for change detection
                originalContentMap[item.key] = (item.value || '');
            }
        });
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

async function saveContent() {
    // Only save inputs inside the currently active section to avoid overwriting
    // content for other pages (e.g. editing Contact should not clear Home content)
    const activeSection = document.querySelector('.tab-content.active');
    if (!activeSection) {
        alert('No active section to save.');
        return;
    }

    const inputs = activeSection.querySelectorAll('input[type="text"], textarea');
    const updates = [];

    inputs.forEach(input => {
        // Exclude modal/new-service inputs and elements without an id
        if (input.id && !input.id.startsWith('new-service')) {
            const key = input.id;
            const newValue = input.value || '';
            const original = originalContentMap[key] || '';

            // Only include fields that have changed
            if (newValue !== original) {
                // If new value is empty, confirm with the user
                if (newValue.trim() === '') {
                    const ok = confirm(`The field "${key}" is empty. This will clear its value site-wide. Continue?`);
                    if (!ok) return; // skip this field
                }
                updates.push({ key, value: newValue });
                // update original map so subsequent saves reflect the new baseline
                originalContentMap[key] = newValue;
            }
        }
    });

    try {
        const response = await fetch('/api/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            alert('Content saved successfully!');
        } else {
            alert('Error saving content');
        }
    } catch (error) {
        console.error('Error saving content:', error);
        alert('Error saving content');
    }
}

// Gallery Management
async function loadGallery() {
    try {
        const response = await fetch('/api/gallery');
        const images = await response.json();
        const grid = document.getElementById('gallery-grid-admin');
        grid.innerHTML = '';

        images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'gallery-card-admin';
            card.style.border = '1px solid #ddd';
            card.style.borderRadius = '8px';
            card.style.overflow = 'hidden';
            card.innerHTML = `
                <img src="${image.image_url}" alt="${image.title}" style="width: 100%; height: 150px; object-fit: cover;">
                <div style="padding: 10px;">
                    <h4 style="margin: 0 0 10px; font-size: 0.9rem; color: #1e293b;">${image.title}</h4>
                    <button class="btn btn-danger btn-block" onclick="deleteGalleryImage(${image.id})" style="font-size: 0.8rem; padding: 5px;">Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function showAddGalleryModal() {
    document.getElementById('add-gallery-modal').style.display = 'flex';
}

function closeGalleryModal() {
    document.getElementById('add-gallery-modal').style.display = 'none';
}

async function addGalleryImage() {
    const title = document.getElementById('new-gallery-title').value;
    const imageUrl = document.getElementById('new-gallery-url').value;

    if (!title || !imageUrl) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, image_url: imageUrl })
        });

        if (response.ok) {
            closeGalleryModal();
            loadGallery();
            document.getElementById('new-gallery-title').value = '';
            document.getElementById('new-gallery-url').value = '';
        } else {
            alert('Error adding image');
        }
    } catch (error) {
        console.error('Error adding image:', error);
        alert('Error adding image');
    }
}

async function deleteGalleryImage(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
        const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadGallery();
        } else {
            alert('Error deleting image');
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

// Services Management
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        const services = await response.json();
        const tbody = document.getElementById('services-table-body');
        if (tbody) {
            tbody.innerHTML = '';
            services.forEach(service => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="material-icons-outlined">${service.icon}</span></td>
                    <td>${service.title}</td>
                    <td>${service.description}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="editService(${service.id}, '${service.title}', '${service.description}', '${service.icon}')" style="padding: 5px 10px; font-size: 0.8rem; margin-right: 5px;">Edit</button>
                        <button class="btn btn-danger" onclick="deleteService(${service.id})" style="padding: 5px 10px; font-size: 0.8rem;">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

function showAddServiceModal() {
    document.getElementById('add-service-modal').style.display = 'flex';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

async function addService() {
    const title = document.getElementById('new-service-title').value;
    const description = document.getElementById('new-service-desc').value;
    const icon = document.getElementById('new-service-icon').value;

    if (!title || !description || !icon) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, icon })
        });

        if (response.ok) {
            closeModal();
            loadServices();
            document.getElementById('new-service-title').value = '';
            document.getElementById('new-service-desc').value = '';
            document.getElementById('new-service-icon').value = '';
        } else {
            alert('Error adding service');
        }
    } catch (error) {
        console.error('Error adding service:', error);
        alert('Error adding service');
    }
}

let currentEditServiceId = null;

function editService(id, title, desc, icon) {
    currentEditServiceId = id;
    document.getElementById('edit-service-title').value = title;
    document.getElementById('edit-service-desc').value = desc;
    document.getElementById('edit-service-icon').value = icon;
    document.getElementById('edit-service-modal').style.display = 'flex';
}

async function updateService() {
    const title = document.getElementById('edit-service-title').value;
    const description = document.getElementById('edit-service-desc').value;
    const icon = document.getElementById('edit-service-icon').value;

    if (!title || !description || !icon) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`/api/services/${currentEditServiceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, icon })
        });

        if (response.ok) {
            closeModal();
            loadServices();
            currentEditServiceId = null;
        } else {
            alert('Error updating service');
        }
    } catch (error) {
        console.error('Error updating service:', error);
        alert('Error updating service');
    }
}


async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
        const response = await fetch(`/api/services/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadServices();
        } else {
            alert('Error deleting service');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
    }
}

// Bookings Management
async function loadBookings() {
    try {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();
        const tbody = document.getElementById('bookings-table-body');
        if (tbody) {
            tbody.innerHTML = '';
            bookings.forEach(booking => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${booking.id}</td>
                    <td>${booking.name}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.service_type}</td>
                    <td>${booking.email}</td>
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td>${new Date(booking.created_at).toLocaleDateString()}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}
