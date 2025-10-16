// Welcome page scroll-based animations (2-phase)
const mask = document.querySelector('.mask');
const backgroundImage = document.querySelector('.background-image');
const welcomeText = document.querySelector('.welcome-text');
const navCards = document.querySelector('.nav-cards');
const scrollIndicator = document.querySelector('.scroll-indicator');
const personalInfoCard = document.getElementById('personal-info-card');
const subCardsContainer = document.getElementById('sub-cards');

let ticking = false;

// Handle expandable card click
personalInfoCard.addEventListener('click', () => {
    const wasExpanded = personalInfoCard.classList.contains('expanded');
    personalInfoCard.classList.toggle('expanded');
    subCardsContainer.classList.toggle('expanded');

    // Scroll the personal info card to the top of the cards container when expanding
    if (!wasExpanded) {
        setTimeout(() => {
            personalInfoCard.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }, 100);
    }
});

function updateAnimation() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / maxScroll;

    // Phase 1: Expand the circular hole (0% - 50% scroll)
    if (scrollPercent <= 0.5) {
        const phase1Progress = scrollPercent / 0.5;
        const holeSize = 30 + (120 * phase1Progress); // From 30% to 150%
        const holeX = 20 + (30 * phase1Progress); // From 20% to 50%

        // Use radial-gradient to create a hole in the black mask
        mask.style.background = `radial-gradient(circle at ${holeX}% 50%, transparent ${holeSize}%, var(--md-sys-color-surface) ${holeSize}%)`;
        mask.classList.remove('hidden');

        // Keep background full size
        backgroundImage.classList.remove('shrink');

        // Fade out welcome text
        welcomeText.style.opacity = 1 - (phase1Progress * 1.5);

        // Ensure cards are hidden and inactive
        navCards.style.opacity = 0;
        navCards.classList.remove('active');

        // Hide scroll indicator after initial scroll
        if (scrollPercent > 0.05) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    }

    // Phase 2: Full reveal, then shrink image and show navigation cards (50% - 100% scroll)
    else {
        // Hide the mask completely
        mask.classList.add('hidden');
        welcomeText.style.opacity = 0;
        scrollIndicator.classList.add('hidden');

        const phase2Progress = (scrollPercent - 0.5) / 0.5;

        // Shrink and move background image to the right
        backgroundImage.classList.add('shrink');

        // Fade in nav cards
        navCards.style.opacity = phase2Progress;

        if (phase2Progress > 0.3) {
            navCards.classList.add('active');
        } else {
            navCards.classList.remove('active');
        }
    }

    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimation);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Initial call
updateAnimation();
