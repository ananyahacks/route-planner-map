# Route Planner Map

A GraphHopper-style route planner web application that allows users to search for locations and calculate routes between two points using different modes of transport.

This project integrates **Leaflet.js**, **OpenStreetMap**, and the **OpenRouteService API** to display interactive maps and generate route paths with estimated travel distance and duration.

---

## Features

- Interactive map interface using **Leaflet**
- **Location search with autocomplete suggestions**
- Select **start and destination points**
- Calculate routes for multiple transport modes:
  - 🚗 Driving  
  - 🚶 Walking  
  - 🚴 Cycling
- Displays **distance and estimated travel time**
- Dynamic route rendering on the map
- Clean and simple UI inspired by modern route planning applications

---

## Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Libraries & APIs**
- Leaflet.js
- OpenStreetMap
- OpenRouteService API

---

## How It Works

1. The user searches for a starting point and destination using the search inputs.
2. The application retrieves geographic coordinates for the selected locations.
3. These coordinates are sent to the **OpenRouteService API**.
4. The API calculates the route and returns geometry data.
5. The route is rendered on the map using **Leaflet polylines**, along with the estimated distance and travel time.

---

## Project Structure

route-planner-map
│
├── index.html
├── style.css
├── script.js
└── README.md

---

## What I Learned

While building this project, I explored:

- Integrating **third-party APIs** into a JavaScript application
- Building interactive maps using **Leaflet**
- Handling **asynchronous requests with fetch**
- Working with **geographic coordinates and routing data**
- Using **Git and GitHub for version control**

---

## Future Improvements

Possible enhancements include:

- Swapping start and destination locations
- Adding alternative route suggestions
- Displaying step-by-step directions
- Improving UI responsiveness

---

## Author

**Ananya Chakraborty**