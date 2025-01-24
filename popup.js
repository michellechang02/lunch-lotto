// popup.js

document.addEventListener("DOMContentLoaded", () => {
    const intervalInput = document.getElementById("interval");
    const saveButton = document.getElementById("save");
  
    // Load the saved interval from storage
    chrome.storage.sync.get(["reminderInterval"], (result) => {
      if (result.reminderInterval) {
        intervalInput.value = result.reminderInterval;
      }
    });
  
    // Save the new interval
    saveButton.addEventListener("click", () => {
      const interval = parseInt(intervalInput.value, 10);
      if (interval >= 1) {
        chrome.storage.sync.set({ reminderInterval: interval }, () => {
          alert(`Reminder interval set to ${interval} minutes.`);
        });
      } else {
        alert("Please enter a valid interval (at least 1 minute).");
      }
    });
  });
  