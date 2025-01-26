# **Lunch Lotto – Your Fun & Easy Lunch Picker!**  

Welcome to **Lunch Lotto**, a Chrome extension designed to take the guesswork out of choosing what to eat for lunch! Whether you're indecisive or just looking to explore new healthy options, Lunch Lotto makes meal selection effortless and fun.  

This project was created for the **2025 MCIT Hackathon**, with the goal of promoting healthier eating habits while simplifying the decision-making process.  

---  

## **Why Lunch Lotto?**  
Are you tired of wasting time trying to figure out where to eat? Do you always end up going to the same places? Lunch Lotto helps by:  
- Suggesting healthy restaurants near you  
- Randomizing choices to introduce variety  
- Providing instant access to restaurant details via Google Maps  
- Making lunch decisions quick, fun, and stress-free!  

---  

## **Key Features**  

- 🎯 **Smart Recommendations** – Uses the **Google Maps API** to find nearby healthy restaurants based on your location, filtering by open status by default.  
- 🎡 **Interactive Spin Wheel** – A fun and engaging way to randomly select a lunch spot, reducing decision fatigue and social pressure, perfect for individuals and group outings.  
- ⚙️ **Customizable Preferences** – Personalize your search by adjusting filters such as distance and price range to suit your needs.  
- 🌍 **Quick Google Maps Access** – Clickable restaurant links allow you to instantly view restaurant details, directions, and reviews.
  
---  

## **How It Works**  

1. **Install the extension** from the Chrome Web Store (coming soon!).  
2. **Click the extension icon** to open Lunch Lotto.  
3. **Spin the wheel** to randomly pick a healthy lunch spot nearby.  
4. **Click the result** to view it instantly on Google Maps.  
5. **Customize settings** like distance and price range to refine your options.  

---  

## **Installation Guide**

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/jessie-sr/lunch-lotto.git
   ```  

2. **Replace the Google Maps API Key:**  
   - Open the `popup.js` file in a code editor (e.g., VS Code).  
   - Find the line containing:  
     ```javascript
     const apiKey = "YOUR_API_KEY";
     ```
   - Replace `"YOUR_API_KEY"` with your own **Google Maps API Key**.  
     Example:  
     ```javascript
     const apiKey = "AIzaSy12345EXAMPLE";
     ```

   - If you don’t have a Google Maps API Key yet, follow these steps:
     1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
     2. Create or select a project.
     3. Navigate to **APIs & Services > Credentials** and click **Create Credentials**.
     4. Select **API Key**, copy the generated key, and replace the placeholder in `popup.js`.

3. **Open Chrome and navigate to:**  
   ```text
   chrome://extensions/
   ```

4. **Enable Developer Mode:**  
   - Toggle the **Developer Mode** switch in the top-right corner.

5. **Load the Extension:**  
   - Click **"Load unpacked"** and select the project folder you just cloned.  

6. **Start Using Lunch Lotto:**  
   - The Lunch Lotto icon will appear in your Chrome toolbar.  
   - Click the icon, spin the wheel, and let it decide your lunch spot!


---  

## **Demo**  

Watch our demo video to see Lunch Lotto in action:  
[Hackathon 2025 - Lunch Lotto](https://youtu.be/i_liACGagPY)

---  


