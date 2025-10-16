// Configuration - Update this to FastAPI backend API URL
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:9001'
    : 'https://api.errisntnil.icu';

// State management
let allCovers = [];
let selectedCover = null;

// DOM elements
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const coversSection = document.getElementById('covers-section');
const coversGrid = document.getElementById('covers-grid');
const coverModal = document.getElementById('cover-modal');
const coverModalClose = document.querySelector('.cover-modal-close');
const modalTagBadge = document.getElementById('modal-tag-badge');
const modalTitle = document.getElementById('modal-title');
const modalAbstract = document.getElementById('modal-abstract');
const modalDescription = document.getElementById('modal-description');
const modalCoverImg = document.getElementById('modal-cover-img');
const btnOpenCollection = document.getElementById('btn-open-collection');

// Initialize the app
async function init() {
    await loadCovers();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    coverModalClose.addEventListener('click', closeCoverModal);
    coverModal.addEventListener('click', (e) => {
        if (e.target === coverModal) {
            closeCoverModal();
        }
    });
    btnOpenCollection.addEventListener('click', openCollection);
}

// Load covers
async function loadCovers() {
    showLoading();
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/api/covers`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.covers.length > 0) {
            allCovers = data.covers;
            renderCovers(data.covers);
            coversSection.style.display = 'block';
        } else {
            showError('No collections available yet.');
        }
    } catch (err) {
        showError(`Failed to load collections: ${err.message}`);
        console.error(err);
    } finally {
        hideLoading();
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
    item.onclick = () => openCoverModal(cover);

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

// Open cover modal
function openCoverModal(cover) {
    selectedCover = cover;

    modalTagBadge.textContent = cover.tag;
    modalTitle.textContent = cover.title;
    modalAbstract.textContent = cover.abstract;

    if (cover.description && cover.description.trim() !== '') {
        modalDescription.innerHTML = `<h3>About this collection</h3><p>${cover.description}</p>`;
        modalDescription.style.display = 'block';
    } else {
        modalDescription.style.display = 'none';
    }

    modalCoverImg.src = cover.cover_url;
    modalCoverImg.alt = cover.title;

    coverModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close cover modal
function closeCoverModal() {
    coverModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
    selectedCover = null;
}

// Open collection (navigate to gallery page)
function openCollection() {
    if (selectedCover) {
        // Navigate to gallery.html with tag parameter
        window.location.href = `gallery.html?tag=${encodeURIComponent(selectedCover.tag)}`;
    }
}

// UI helpers
function showLoading() {
    loading.style.display = 'block';
    coversSection.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    coversSection.style.display = 'none';
}

function hideError() {
    error.style.display = 'none';
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
