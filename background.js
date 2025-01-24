// background.js

// Listen for alarms to trigger notifications
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "eyeRelaxationReminder") {
      // Create a notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon-128.png",
        title: "Time to Relax Your Eyes!",
        message: "Take a 1-minute break. Try blinking slowly or focusing on a distant object.",
        priority: 2
      });
    }
  });
  
  // Set an initial alarm when the extension is installed
  chrome.runtime.onInstalled.addListener(() => {
    // Set an alarm to trigger every 20 minutes (default)
    chrome.alarms.create("eyeRelaxationReminder", { delayInMinutes: 20, periodInMinutes: 20 });
  });
  
  // Listen for changes to the interval (optional enhancement)
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.reminderInterval) {
      const interval = changes.reminderInterval.newValue;
      chrome.alarms.clear("eyeRelaxationReminder", () => {
        chrome.alarms.create("eyeRelaxationReminder", { delayInMinutes: interval, periodInMinutes: interval });
      });
    }
  });
  