/* =========================================
   SECTION 1: HERO CAROUSEL LOGIC
   (Continuous "Train" Effect for Landing Page)
   ========================================= */

const heroServices = [
    { name: 'Electrician', desc: 'Wiring & Repairs', icon: '⚡' },
    { name: 'Plumber', desc: 'Pipe & Leak Fixes', icon: '🔧' },
    { name: 'Cleaning', desc: 'Full Deep Clean', icon: '🧹' },
    { name: 'Painting', desc: 'Wall & Texture', icon: '🎨' },
    { name: 'HVAC', desc: 'AC & Heating', icon: '❄️' }
];

const heroContainer = document.getElementById('service-carousel');

// Build the HTML structure for Hero Cards
heroContainer.innerHTML = `<div class="coverflow-wrapper"><div class="coverflow-stage"></div></div>`;
const heroStage = heroContainer.querySelector('.coverflow-stage');
const heroCards = [];

// Create Cards
heroServices.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'cf-card';
    const hue = [220, 280, 10, 160, 40][index % 5];
    card.innerHTML = `
        <div class="cf-avatar" style="color:hsl(${hue},70%,50%);background:hsl(${hue},70%,96%);">${item.icon}</div>
        <h3 class="cf-name">${item.name}</h3>
        <p class="cf-role">${item.desc}</p>`;
    
    // Pause on click or hover interaction
    card.addEventListener('mouseenter', () => isHeroPaused = true);
    card.addEventListener('mouseleave', () => isHeroPaused = false);
    
    heroStage.appendChild(card);
    heroCards.push(card);
});

// Animation Variables for Hero
let heroScrollPos = 0;
let heroScrollSpeed = 0.006; // Slow smooth train speed
let isHeroPaused = false;
const HERO_SPACING = 120; // Distance between cards
const TOTAL_HERO_CARDS = heroCards.length;

function animateHero() {
    if (!isHeroPaused) {
        heroScrollPos += heroScrollSpeed;
    }

    if (heroScrollPos > TOTAL_HERO_CARDS) heroScrollPos -= TOTAL_HERO_CARDS;

    heroCards.forEach((card, index) => {
        let offset = index - heroScrollPos;
        
        // Wrap offset
        offset = ((offset % TOTAL_HERO_CARDS) + TOTAL_HERO_CARDS) % TOTAL_HERO_CARDS;
        if (offset > TOTAL_HERO_CARDS / 2) offset -= TOTAL_HERO_CARDS;

        const absOffset = Math.abs(offset);
        
        // Style Logic:
        const translateX = offset * HERO_SPACING;
        const scale = 1 - (absOffset * 0.2);
        const opacity = Math.max(0, 1 - (absOffset * 0.4));
        const zIndex = 100 - Math.round(absOffset * 10);
        
        // Apply Styles
        card.style.transform = `translateX(${translateX}px) scale(${Math.max(0, scale)})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        
        // --- CHANGED: Border logic removed here ---
        card.style.border = 'none'; 
    });

    requestAnimationFrame(animateHero);
}

// Start Hero Animation
animateHero();



/* =========================================
   SECTION 2: DISCOVERY CAROUSEL LOGIC
   (Original "Snap" Effect - Discrete Steps)
   ========================================= */

const discoveryCards = document.querySelectorAll('#discovery-container .card');
let discoveryIndex = 0;
const DISCOVERY_SPACING = 340;

function updateDiscovery() {
    const total = discoveryCards.length;
    discoveryCards.forEach((card, index) => {
        let offset = (index - discoveryIndex) % total;
        if (offset < 0) offset += total;
        if (offset > total / 2) offset -= total;

        // Detect wrapping to prevent "flying across screen"
        const lastOffset = parseFloat(card.dataset.lastOffset || 0);
        const isWrapping = Math.abs(offset - lastOffset) > 2;

        if (isWrapping) {
            card.style.transition = 'none';
            card.style.opacity = '0';
        } else {
            // Restore transition for the snap effect
            card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
        }

        const absOffset = Math.abs(offset);
        const scale = offset === 0 ? 1 : Math.pow(0.85, absOffset);
        const opacity = offset === 0 ? 1 : 0.6;
        
        card.style.setProperty('--x-offset', `${offset * DISCOVERY_SPACING}px`);
        card.style.setProperty('--scale', scale);
        card.style.zIndex = 100 - absOffset;
        
        if (!isWrapping) {
            card.style.opacity = opacity;
        } else {
            // Force reflow
            void card.offsetWidth;
            setTimeout(() => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
                card.style.opacity = opacity;
            }, 50);
        }
        card.dataset.lastOffset = offset;
    });
}

function setActive(index) {
    discoveryIndex = index;
    updateDiscovery();
    resetDiscoveryAuto();
}

// Auto-advance every 5 seconds (Discrete Step)
let discoveryTimer = setInterval(() => {
    discoveryIndex = (discoveryIndex + 1) % discoveryCards.length;
    updateDiscovery();
}, 5000);

function resetDiscoveryAuto() {
    clearInterval(discoveryTimer);
    discoveryTimer = setInterval(() => {
        discoveryIndex = (discoveryIndex + 1) % discoveryCards.length;
        updateDiscovery();
    }, 5000);
}

// Initialize Discovery render
updateDiscovery();