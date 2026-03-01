<div align="center">
  
  <h1>🚗 ParkEasy</h1>
  <p><b>Stop circling LA. Find your spot instantly.</b></p>

  <a href="https://github.com/dadaxingxing/ParkEasy"><strong>Explore the docs »</strong></a>
  <br />
  <br />
</div>

> **The Pitch:** ParkEasy eliminates "parking anxiety" in Los Angeles by providing a real-time map of available street parking. We use live sensor data to find your spot instantly, saving you time and reducing emissions.

---

## 💡 The Problem
Drivers in LA spend an average of 20 minutes circling for a spot. This causes frustration, wasted time, and unnecessary environmental impact from idling engines.

## 📍 What it does
* **Live Mapping:** Visualizes vacant and occupied parking meters across Los Angeles.
* **Top 3 Recommendations:** Instantly identifies the three closest open spots to your destination.
* **Precision Routing:** Uses the **Haversine Formula** for accurate GPS-to-destination distance calculation.

## 💻 Built With
<div align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Azure Maps" />
</div>

<br />

## 🚧 Challenges & Wins
* **API Management:** Navigated rate limits and caching for the LADOT dataset to ensure snappy searches.
* **Math Logic:** Implemented great-circle distance math to solve "as-the-crow-flies" proximity.
* **Teamwork:** Built from scratch in 48 hours with a newly formed team, focusing on a high-value MVP.

## 🚀 What's Next
* **Predictive AI:** Forecast parking availability 30–60 minutes in advance.
* **EV Filters:** Locate spots with integrated charging stations.
* **IoT Expansion:** Integration with smart-city infrastructure and autonomous vehicle sensors.

---
*Built with ❤️ for the LA Hackathon*