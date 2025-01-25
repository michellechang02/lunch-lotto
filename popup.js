const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";

async function fetchRestaurants() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=800&type=restaurant&keyword=healthy&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const restaurants = data.results.map((place) => place.name).slice(0, 8);
    updateWheel(restaurants);
  });
}

function updateWheel(restaurants) {
  options.length = 0;
  options.push(...restaurants);
  drawWheel();
}

fetchRestaurants();
