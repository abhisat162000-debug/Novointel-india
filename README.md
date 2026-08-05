# 🇩🇰 NovoIntel India | Tier-Based Commercial Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-novointel--india.surge.sh-001965?style=for-the-badge&logo=google-chrome&logoColor=white)](https://novointel-india.surge.sh)
[![Novo Nordisk Palette](https://img.shields.io/badge/Theme-Novo_Nordisk_Navy_%26_White-008BC6?style=for-the-badge)](https://novointel-india.surge.sh)
[![License](https://img.shields.io/badge/License-MIT-059669.svg?style=for-the-badge)](LICENSE)

An AI-powered commercial intelligence overlay designed for **Novo Nordisk India** to bridge the gap between nationwide distributor sales data and localized tier-wise commercial execution across **Tier-1 Metros**, **Tier-2 Growth Cities**, and **Tier-3 Semi-Urban Hubs**.

---

## 🎯 Executive Problem Statement

> **"Novo Nordisk India lacks an automated data intelligence layer to understand tier-wise sales performance—leaving commercial teams reliant on manual Excel projections to decide which products to launch in Tier-2 vs Tier-1 cities, and how to allocate sales reps to capture revenue gaps."**

### Key Market Dynamics Addressed:
1. **Tier-1 Metros (NCR, Mumbai, Bengaluru)**: Saturated, high GLP-1 & smart pen adoption (+4% YoY growth).
2. **Tier-2 Growth Cities (Lucknow, Jaipur, Coimbatore, Patna)**: High diabetes burden with an estimated **₹285 Cr untapped opportunity gap** caused by doctor coverage deficits and distributor credit caps (+28% uncaptured demand).
3. **Tier-3 / Semi-Urban Hubs**: Face power outages and 2°C-8°C cold-chain logistics vulnerabilities.

---

## ✨ Core Features & Modules

### 🗺️ 1. Interactive National Commercial Intelligence Map
* Built with **Leaflet.js** using CartoDB Voyager light tiles.
* Features pulsing markers for Tier-1 (Green) and Tier-2 (Amber) city clusters across India.
* **Hover Tooltips**: Instant preview of actual revenue vs. AI epidemiological potential.
* **Click Deep-Dive Drawer**: Interactive panel detailing:
  * **Operational Bottlenecks** (*What is Lacking?*)
  * **Sales & Field Rep Parameters**
  * **Marketing & HCP Engagement Metrics**
  * **AI Prescriptive Interventions**

### 📊 2. Tier Commercial Control Tower
* Interactive Chart.js visualizer comparing actual revenue against AI-calculated market potential across all market tiers.
* Therapy mix breakdown across Oral GLP-1 (Rybelsus), Premix Insulin (Ryzodeg), Base Insulin (Tresiba), and Obesity (Wegovy).

### 🚀 3. Propensity Launch Matcher Engine
* Calculates affinity scores (0-100) for pipeline therapies (*Icodec once-weekly basal insulin*, *Wegovy*, *Rybelsus 14mg*, *NovoPen 6*).
* Generates a 3-phase phased rollout roadmap (Tier-1 Metro Specialists ➔ Tier-2 Regional Nursing Homes ➔ Tier-3 Cold-Chain Stockists).

### 🎛️ 4. Field Resource Allocator & Simulator
* Interactive sliders to simulate moving sales rep capacity (+15% to Tier-2) and marketing CME spend.
* Dynamic 12-month ROI and revenue delta trajectory calculation (+₹214 Cr projected gain).

### 🤖 5. Natural Language AI Decision Assistant
* Smart intent-matching assistant answering strategic executive queries on regional performance, GLP-1 adoption, and logistics.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, Vanilla JavaScript (ES6+), Modern Vanilla CSS3 (Custom Design Tokens)
* **Branding**: Official Novo Nordisk Navy (`#001965`), Apis Blue (`#008bc6`), and Crisp White (`#ffffff`)
* **GIS & Mapping**: [Leaflet.js v1.9.4](https://leafletjs.com/) with CartoDB Voyager Tiles
* **Data Visualization**: [Chart.js v4](https://www.chartjs.org/)
* **Icons**: [Lucide Icons](https://lucide.dev/)

---

## 🚀 Quick Start (Local Setup)

No dependencies or node build steps required! Simply clone and open:

```bash
# 1. Clone the repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/novointel-india.git

# 2. Navigate to the project directory
cd novointel-india

# 3. Open in your default browser
open index.html
```

Or serve locally with Python:
```bash
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  <strong>Developed for Commercial Data Science & AI Strategy • Novo Nordisk India</strong>
</p>
