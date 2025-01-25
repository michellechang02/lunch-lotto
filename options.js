document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["distance", "price"], (data) => {
    document.getElementById("distance").value = data.distance || 0.5;
    document.getElementById("price").value = data.price || "2,3";
  });
});

document.getElementById("save").addEventListener("click", () => {
  const distance = parseFloat(document.getElementById("distance").value);
  const price = document.getElementById("price").value;

  chrome.storage.sync.set({ distance, price }, () => {
    alert("Settings saved!");
  });
});

document.getElementById("settings").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

  