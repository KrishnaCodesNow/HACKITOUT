let services = [];

const serviceContainer = document.getElementById("services");
const searchInput = document.getElementById("search");
const heroSearchInput = document.getElementById("heroSearch");
const categorySelect = document.getElementById("category");
const availabilitySelect = document.getElementById("availability");
const sortBySelect = document.getElementById("sortBy");
const loadingDiv = document.getElementById("loading");
const emptyDiv = document.getElementById("empty");

function renderServices(list) {
  serviceContainer.innerHTML = "";

  if (list.length === 0) {
    serviceContainer.classList.add("hidden");
    emptyDiv.classList.remove("hidden");
    return;
  }

  serviceContainer.classList.remove("hidden");
  emptyDiv.classList.add("hidden");

  list.forEach((service, index) => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.style.setProperty('--index', index);

    const availabilityClass = service.availability.toLowerCase().replace(' ', '-');
    const verifiedBadge = service.verified ? '<span class="verified-badge">✓ Verified Pro</span>' : '';
    const buttonText = service.availability === 'Available' ? '📅 Book Now' : '👁️ View Profile';

    card.innerHTML = `
      <div class="card-image-wrapper">
        <div class="card-image-pattern"></div>
        <div class="card-image-icon">${service.icon}</div>
        <div class="card-badge-top">${service.category}</div>
      </div>
      
      <div class="card-content">
        <div class="card-header">
          <div>
            <div class="card-title">${service.name}</div>
            <div class="card-subtitle">${service.category} Specialist</div>
          </div>
          ${verifiedBadge}
        </div>
        
        <div class="card-info-grid">
          <div class="info-item">
            <span class="info-icon">📍</span>
            <span>${service.location}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">💼</span>
            <span>${service.experience} experience</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="rating-box">
            <span class="rating-star">★</span>
            <div>
              <div class="rating-value">${service.rating}</div>
              <div class="rating-reviews">${service.reviews} reviews</div>
            </div>
          </div>
          <div class="status-badge status-${availabilityClass}">
            <span class="status-dot"></span>
            ${service.availability}
          </div>
        </div>

        <button class="book-button" onclick="bookService('${service.name}', '${service.availability}')">
          ${buttonText}
        </button>
      </div>
    `;

    serviceContainer.appendChild(card);
  });
}

function filterServices() {
  const search = searchInput.value.toLowerCase();
  const category = categorySelect.value;
  const availability = availabilitySelect.value;
  const sortBy = sortBySelect.value;

  let filtered = services.filter(service =>
    (service.name.toLowerCase().includes(search) || 
     service.category.toLowerCase().includes(search) ||
     service.location.toLowerCase().includes(search)) &&
    (category === "" || service.category === category) &&
    (availability === "" || service.availability === availability)
  );

  if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'experience') {
    filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
  }

  renderServices(filtered);
}

function filterByCategory(cat) {
  categorySelect.value = cat;
  filterServices();
  document.querySelector('.filters-section').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
}

function searchFromHero() {
  searchInput.value = heroSearchInput.value;
  filterServices();
  document.querySelector('.filters-section').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

function bookService(serviceName, availability) {
  if (availability === 'Available') {
    alert(`🎉 Booking Request Sent!\n\n✓ Service: ${serviceName}\n✓ Confirmation call within 30 minutes\n✓ Professional will arrive at scheduled time\n\nThank you for choosing ServiceHub!`);
  } else {
    alert(`📋 ${serviceName}\n\nThis professional is currently ${availability.toLowerCase()}.\n\nWould you like to:\n• View their full profile\n• Schedule for later\n• Find similar professionals\n\nContact support for assistance.`);
  }
}

// Initialize
async function init() {
  try {
    const response = await fetch('/api/services');
    services = await response.json();
    loadingDiv.classList.add("hidden");
    renderServices(services);
  } catch (error) {
    console.error('Error loading services:', error);
    loadingDiv.classList.add("hidden");
    emptyDiv.classList.remove("hidden");
  }
}

init();

// Event listeners
searchInput.addEventListener("input", filterServices);
categorySelect.addEventListener("change", filterServices);
availabilitySelect.addEventListener("change", filterServices);
sortBySelect.addEventListener("change", filterServices);
heroSearchInput.addEventListener("keypress", function(e) {
  if (e.key === 'Enter') searchFromHero();
});
