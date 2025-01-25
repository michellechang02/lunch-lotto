const apiKey = "AIzaSyDhj7No-w02oGe3eJBjXoNJiFNTaoVARaA";
const defaultSettings = {
  distance: 0.5,       // Default search radius in miles
  price: "2,3",        // Google Places API uses 1-4 ($ - $$$$)
  dietary: "",         // Empty means no filter (future: vegetarian, gluten-free, etc.)
};
// Convert miles to meters (Google Maps API uses meters)
function milesToMeters(miles) {
  return miles * 1609.34;
}

// Load user settings or use defaults
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaultSettings, (settings) => {
      resolve(settings);
    });
  });
}

async function fetchRestaurants() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude: lat, longitude: lng } = position.coords;
    const settings = await loadSettings();

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${milesToMeters(settings.distance)}&type=restaurant&keyword=healthy&minprice=${settings.price[0]}&maxprice=${settings.price[2]}&fields=name,opening_hours&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Filter out places that are closed
      const openRestaurants = data.results
        .filter((place) => place.opening_hours && place.opening_hours.open_now)
        .map((place) => place.name);

      // Remove duplicate restaurants and update the wheel
      const uniqueRestaurants = removeDuplicates(openRestaurants);
      updateWheel(uniqueRestaurants.slice(0, 8));  // Limit to 8 options

    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      alert("Failed to fetch restaurant data. Please try again.");
    }
  });
}

function removeDuplicates(restaurants) {
  const seen = new Set();
  return restaurants.filter((restaurant) => {
    const name = restaurant.toLowerCase().trim();  // Normalize case and whitespace
    if (seen.has(name)) {
      return false;  // Ignore duplicate entry
    }
    seen.add(name);
    return true;  // Keep unique entry
  });
}

function updateWheel(restaurants) {
  options.length = 0;
  options.push(...restaurants);
  drawWheel();
}

// 🛠️ Toggle Settings View
function showSettings() {
  document.getElementById("main-view").style.display = "none";
  document.getElementById("settings-view").style.display = "block";
}

function hideSettings() {
  document.getElementById("main-view").style.display = "block";
  document.getElementById("settings-view").style.display = "none";
}

// Ensure scripts run only after DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await fetchRestaurants();

  // Spin button event
  document.getElementById("spin").addEventListener("click", () => spin());

  // Open settings view
  document.getElementById("open-settings").addEventListener("click", showSettings);

  // Close settings view
  document.getElementById("close-settings").addEventListener("click", hideSettings);

  // Load saved settings into inputs
  const settings = await loadSettings();
  document.getElementById("distance").value = settings.distance;
  document.getElementById("price").value = settings.price;

  // Save settings
  document.getElementById("save-settings").addEventListener("click", () => {
    const distance = parseFloat(document.getElementById("distance").value);
    const price = document.getElementById("price").value;

    chrome.storage.sync.set({ distance, price }, () => {
      alert("Settings saved!");
      hideSettings();
    });
  });
});