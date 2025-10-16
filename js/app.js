// Configuration - Update this to FastAPI backend API URL
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:9001'
    : 'https://api.errisntnil.icu';

// State management
let currentPage = 0;
const imagesPerPage = 12;
let currentTag = '';
let allImages = [];
let allCovers = [];

// DOM elements
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const tagFilter = document.getElementById('tag-filter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeModal = document.querySelector('.close');
const coversSection = document.getElementById('covers-section');
const coversGrid = document.getElementById('covers-grid');

// Initialize the app
async function init() {
    await loadTags();
    await loadCovers();
    await loadImages();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    tagFilter.addEventListener('change', handleTagChange);
    prevBtn.addEventListener('click', () => changePage(-1));
    nextBtn.addEventListener('click', () => changePage(1));
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
}

// Close modal handler
function closeModalHandler() {
    modal.style.display = 'none';
    modal.scrollTop = 0; // Reset scroll position
}

// Load available tags
async function loadTags() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tags`);
        const data = await response.json();

        if (data.success) {
            data.tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                tagFilter.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Failed to load tags:', err);
    }
}

// Load covers
async function loadCovers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/covers`);
        const data = await response.json();

        if (data.success && data.covers.length > 0) {
            allCovers = data.covers;
            renderCovers(data.covers);
            coversSection.style.display = 'block';
        }
    } catch (err) {
        console.error('Failed to load covers:', err);
    }
}

// Render covers
function renderCovers(covers) {
    coversGrid.innerHTML = '';

    covers.forEach(cover => {
        const coverItem = createCoverItem(cover);
        coversGrid.appendChild(coverItem);
    });
}

// Create a cover item element
function createCoverItem(cover) {
    const item = document.createElement('div');
    item.className = 'cover-item';
    item.onclick = () => filterByTag(cover.tag);

    const img = document.createElement('img');
    img.src = cover.cover_url;
    img.alt = cover.title;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'cover-overlay';

    const title = document.createElement('h3');
    title.textContent = cover.title;

    const abstract = document.createElement('p');
    abstract.textContent = cover.abstract;

    const tag = document.createElement('span');
    tag.className = 'cover-tag';
    tag.textContent = cover.tag;

    overlay.appendChild(title);
    overlay.appendChild(abstract);
    overlay.appendChild(tag);

    item.appendChild(img);
    item.appendChild(overlay);

    return item;
}

// Filter by tag when cover is clicked
function filterByTag(tag) {
    tagFilter.value = tag;
    currentTag = tag;
    currentPage = 0;
    loadImages();
    // Scroll to gallery section
    gallery.scrollIntoView({ behavior: 'smooth' });
}

// Load images from API
async function loadImages() {
    showLoading();
    hideError();

    try {
        const params = new URLSearchParams({
            limit: imagesPerPage,
            offset: currentPage * imagesPerPage
        });

        if (currentTag) {
            params.append('tag', currentTag);
        }

        const response = await fetch(`${API_BASE_URL}/api/images?${params}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            allImages = data.images;
            renderGallery(data.images);
            updatePagination(data.count);
        } else {
            throw new Error('Failed to load images');
        }
    } catch (err) {
        showError(`Failed to load images: ${err.message}`);
        console.error(err);
    } finally {
        hideLoading();
    }
}

// Render gallery items
function renderGallery(images) {
    gallery.innerHTML = '';

    if (images.length === 0) {
        gallery.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No images found.</p>';
        return;
    }

    images.forEach(image => {
        const item = createGalleryItem(image);
        gallery.appendChild(item);
    });
}

// Create a gallery item element
function createGalleryItem(image) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.onclick = () => openModal(image);

    const img = document.createElement('img');
    img.src = image.image_url;
    img.alt = image.title;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'gallery-item-info';

    const title = document.createElement('div');
    title.className = 'gallery-item-title';
    title.textContent = image.title;

    const caption = document.createElement('div');
    caption.className = 'gallery-item-caption';
    caption.textContent = image.caption;

    const tags = document.createElement('div');
    tags.className = 'gallery-item-tags';

    if (image.tag) {
        const tagList = image.tag.split(',').map(t => t.trim());
        tagList.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag;
            tags.appendChild(tagSpan);
        });
    }

    info.appendChild(title);
    info.appendChild(caption);
    info.appendChild(tags);

    item.appendChild(img);
    item.appendChild(info);

    return item;
}

// Open modal with full-size image
function openModal(image) {
    modal.style.display = 'block';
    modal.scrollTop = 0; // Reset scroll position
    modalImg.src = image.image_url;

    let captionHTML = `
        <h2>${image.title}</h2>
        <p>${image.caption}</p>
    `;

    // Add details section if available
    if (image.details && image.details.trim() !== '') {
        captionHTML += `
        <div class="details-section">
            <h3>Details</h3>
            <p>${image.details}</p>
        </div>
        `;
    }

    modalCaption.innerHTML = captionHTML;
}

// Handle tag filter change
async function handleTagChange(e) {
    currentTag = e.target.value;
    currentPage = 0;
    await loadImages();
}

// Change page
async function changePage(direction) {
    currentPage += direction;
    await loadImages();
}

// Update pagination controls
function updatePagination(count) {
    Math.ceil(count / imagesPerPage);
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = count < imagesPerPage;

    pageInfo.textContent = `Page ${currentPage + 1}`;
}

// UI helpers
function showLoading() {
    loading.style.display = 'block';
    gallery.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    gallery.style.display = 'grid';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    gallery.style.display = 'none';
}

function hideError() {
    error.style.display = 'none';
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
