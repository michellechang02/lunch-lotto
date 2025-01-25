document.getElementById("save").addEventListener("click", () => {
    const time = document.getElementById("reminder-time").value;
    chrome.storage.sync.set({ reminderTime: time }, () => {
      alert("Settings saved!");
    });
  });
  