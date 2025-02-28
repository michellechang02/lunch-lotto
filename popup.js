// In production, consider:
// 1. Using chrome.storage to store the key securely
// 2. Fetching it from a secure backend
// 3. Using Chrome's identity API for authentication

const defaultSettings = {
  distance: 0.5,
  price: "2,3",
  dietary: "",
};

function milesToMeters(miles) {
  return miles * 1609.34;
}

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaultSettings, (settings) => {
      resolve(settings);
    });
  });
}

async function loadHistory() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ history: [] }, (data) => {
      resolve(data.history);
    });
  });
}

async function saveHistory(newEntry) {
  const history = await loadHistory();
  history.unshift(newEntry);
  if (history.length > 10) history.pop();
  chrome.storage.sync.set({ history });
}

async function clearHistory() {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ history: [] }, () => {
      resolve();
    });
  });
}

async function updateHistoryView() {
  const history = await loadHistory();
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>No history yet</li>";
    return;
  }

  history.forEach((item) => {
    let listItem = document.createElement("li");
    listItem.textContent = item;
    historyList.appendChild(listItem);
  });
}

async function fetchRestaurants() {
  try {
    document.getElementById("loading-gif").style.display = "block";
    document.getElementById("wheel").style.display = "none";

    // Get user's current location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const radius = milesToMeters(defaultSettings.distance); // Convert miles to meters

      // OpenStreetMap Overpass API query
      const query = `
        [out:json];
        node(around:${radius},${lat},${lon})["amenity"="restaurant"];
        out;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.elements || data.elements.length === 0) {
        alert("No results found! Try adjusting your settings.");
        return;
      }

      let results = data.elements.map((place) => ({
        name: place.tags.name || "Unnamed Restaurant",
        googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`
      }));

      // Remove duplicates
      const seen = new Set();
      results = results.filter((result) => {
        if (seen.has(result.name)) return false;
        seen.add(result.name);
        return true;
      });

      setTimeout(() => {
        document.getElementById("loading-gif").style.display = "none";
        document.getElementById("wheel").style.display = "block";
        updateWheel(results);
      }, 2000);
    }, (error) => {
      console.error("Error getting location:", error);
      alert("Location access is required to find nearby restaurants.");
      document.getElementById("loading-gif").style.display = "none";
      document.getElementById("wheel").style.display = "block";
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("loading-gif").style.display = "none";
    document.getElementById("wheel").style.display = "block";
  }
}


function updateWheel(restaurants) {
  options.length = 0;
  const shuffledRestaurants = [...restaurants].sort(() => Math.random() - 0.5);
  const selectedRestaurants = shuffledRestaurants.slice(0, 8);

  options.push(...selectedRestaurants);
  drawWheel();
}

function spin() {
  if (options.length === 0) {
    alert("No restaurants available. Try refreshing!");
    return;
  }

  const selected = options[Math.floor(Math.random() * options.length)];
  document.getElementById("selected-restaurant").textContent = selected.name;
  document.getElementById("google-maps-link").href = selected.googleMapsLink;
  document.getElementById("google-maps-link").style.display = "block";
  document.getElementById("result-container").style.display = "block";

  saveHistory(selected.name);
}

function showSettings() {
  document.getElementById("main-view").style.display = "none";
  document.getElementById("settings-view").style.display = "block";
}

function hideSettings() {
  document.getElementById("main-view").style.display = "block";
  document.getElementById("settings-view").style.display = "none";
}

function showHistory() {
  document.getElementById("main-view").style.display = "none";
  document.getElementById("history-view").style.display = "block";
  updateHistoryView();
}

function hideHistory() {
  document.getElementById("main-view").style.display = "block";
  document.getElementById("history-view").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchRestaurants();
  await updateHistoryView();

  document.getElementById("spin").addEventListener("click", function() {
    window.spinWheel();
  });
  document.getElementById("open-settings").addEventListener("click", showSettings);
  document.getElementById("close-settings").addEventListener("click", hideSettings);
  document.getElementById("open-history").addEventListener("click", showHistory);
  document.getElementById("close-history").addEventListener("click", hideHistory);
  document.getElementById("clear-history").addEventListener("click", async () => {
    await clearHistory();
    await updateHistoryView();
    swal({ title: "History cleared!", icon: "success", button: false, timer: 1500 });
  });

  const settings = await loadSettings();
  document.getElementById("distance").value = settings.distance;
  document.getElementById("price").value = settings.price;

  document.getElementById("save-settings").addEventListener("click", async () => {
    const distance = parseFloat(document.getElementById("distance").value);
    const price = document.getElementById("price").value;

    chrome.storage.sync.set({ distance, price }, async () => {
      swal({ title: "Settings saved!", icon: "success", button: false });
      hideSettings();
      await fetchRestaurants();
    });
  });

  // Add event listener for the close result button
  document.getElementById("close-result").addEventListener("click", function() {
    document.getElementById("result-container").style.display = "none";
  });
});
