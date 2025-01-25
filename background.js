chrome.alarms.create("dailyReminder", { when: Date.now(), periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyReminder") {
    chrome.notifications.create("lunchTime", {
      type: "basic",
      iconUrl: "assets/icon.png",
      title: "Hunger Game",
      message: "It's time for lunch! Open the Hunger Game extension to find your meal.",
    });
  }
});
