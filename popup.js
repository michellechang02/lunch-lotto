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

// async function fetchRestaurants() {
//   document.getElementById("loading-gif").style.display = "block";
//   navigator.geolocation.getCurrentPosition(async (position) => {
//     const { latitude: lat, longitude: lng } = position.coords;
//     const settings = await loadSettings();

//     const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${milesToMeters(settings.distance)}&type=restaurant&keyword=healthy&minprice=${settings.price[0]}&maxprice=${settings.price[2]}&key=${apiKey}`;

//     const response = await fetch(url);
//     const data = await response.json();
//     const restaurants = data.results.map((place) => place.name).slice(0, 8);

//     updateWheel(restaurants);
//   });
// }
async function fetchRestaurants() {
  try {
    // 🔄 Show Loading GIF and Hide the Wheel
    document.getElementById("loading-gif").style.display = "block";
    document.getElementById("wheel").style.display = "none";

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      const settings = await loadSettings();

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${milesToMeters(settings.distance)}&type=restaurant&keyword=healthy&minprice=${settings.price[0]}&maxprice=${settings.price[2]}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.error("❌ No restaurants found!");
        alert("No restaurants found! Try adjusting your settings.");
        return;
      }

      // ✅ Extract restaurant data
      const restaurants = data.results.slice(0, 8).map((place) => ({
        name: place.name,
        distance: (settings.distance).toFixed(1),
        price: place.price_level ? "$".repeat(place.price_level) : "Unknown",
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        placeId: place.place_id
      }));

      console.log("✅ Restaurants fetched:", restaurants);

      // ✅ Store restaurant details globally
      restaurantDetails = restaurants.reduce((acc, r) => {
        acc[r.name] = r;
        return acc;
      }, {});

      // ⏳ Wait 5 seconds before showing the wheel
      setTimeout(() => {
        document.getElementById("loading-gif").style.display = "none"; // ✅ Hide Loading GIF
        document.getElementById("wheel").style.display = "block"; // ✅ Show the wheel
        updateWheel(restaurants); // ✅ Update the wheel with restaurant names
      }, 2000);

    }, (error) => {
      console.error("❌ Geolocation error:", error);
      alert("Please enable location access to fetch restaurants.");
      document.getElementById("loading-gif").style.display = "none"; // ✅ Hide loading GIF on error
      document.getElementById("wheel").style.display = "block";
    });
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    document.getElementById("loading-gif").style.display = "none"; // ✅ Hide loading GIF on error
    document.getElementById("wheel").style.display = "block";
  }
}


function updateWheel(restaurants) {
  options.length = 0;
  // options.push(...restaurants);
  options.push(...restaurants.map(r => r.name));
  restaurantDetails = restaurants.reduce((acc, r) => { 
    acc[r.name] = r; // ✅ Store full restaurant details
    return acc;
  }, {});
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