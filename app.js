// Initialize Lucide icons on load safely
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (window.lucide && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn('Lucide icon init error:', e);
    }

    initNavigation();
    initOverviewCharts();
    initIndiaMapModule();
    initLaunchModule();
    initSimulatorModule();
    initCopilotModule();
});

// Global state for charts & map
let tierChart, portfolioChart, cityChart, launchChart, simChart, leafletMap;

// City Master Dataset (Tier-1 and Tier-2 Indian Cities)
const citiesDatabase = {
    'delhi': {
        name: 'Delhi NCR Metro Cluster',
        tier: 'Tier-1 Metro',
        tierKey: 'tier1',
        region: 'North India Corridor',
        lat: 28.6139, lng: 77.2090,
        actualRev: '₹580 Cr',
        potentialRev: '₹600 Cr',
        gapRev: '₹20 Cr (3%)',
        topTherapy: 'Oral GLP-1 (Rybelsus)',
        lacking: [
            'Market Saturation: High doctor competition with generic DPP-4/SGLT2 inhibitors.',
            'Patient Churn: Patients switching between corporate hospital chains.',
            'Digital Competition: High online pharmacy discount wars (Pharmeasy, Tata 1mg).'
        ],
        salesParams: {
            'Field Reps Active': '45 Territory Leads',
            'Avg HCP Visit Frequency': '3.2 Visits / Month',
            'Chemist Stocking Rate': '98% Coverage',
            'Prescribing Affinity': '94 / 100 Index'
        },
        marketingParams: {
            'CME Events Hosted': '24 Annual Symposia',
            'Digital Doctor Engagement': '82% Active',
            'Patient Assistance Program': 'High Co-Pay Adoption',
            'Competitor Pressure': 'High (Generic Insulins)'
        },
        aiAction: 'Maintain field presence in Metro endocrinology centers; focus on initiating Rybelsus as early combination therapy with Metformin.'
    },
    'mumbai': {
        name: 'Mumbai Metro Cluster',
        tier: 'Tier-1 Metro',
        tierKey: 'tier1',
        region: 'West India Corridor',
        lat: 19.0760, lng: 72.8777,
        actualRev: '₹520 Cr',
        potentialRev: '₹535 Cr',
        gapRev: '₹15 Cr (3%)',
        topTherapy: 'Wegovy & Rybelsus',
        lacking: [
            'High Out-of-Pocket Expense: Premium lifestyle clinics face price resistance on long-term Wegovy treatment.',
            'Hospital Procurement Delays: Corporate hospital tender cycles take 90+ days.'
        ],
        salesParams: {
            'Field Reps Active': '38 Territory Leads',
            'Avg HCP Visit Frequency': '3.0 Visits / Month',
            'Chemist Stocking Rate': '96% Coverage',
            'Prescribing Affinity': '92 / 100 Index'
        },
        marketingParams: {
            'CME Events Hosted': '20 Annual Symposia',
            'Digital Doctor Engagement': '85% Active',
            'Patient Assistance Program': 'Moderate Adoption',
            'Competitor Pressure': 'Moderate'
        },
        aiAction: 'Partner with top metabolic & bariatric surgery centers in South Mumbai to establish structured GLP-1 weight management protocols.'
    },
    'bengaluru': {
        name: 'Bengaluru Tech Corridor',
        tier: 'Tier-1 Metro',
        tierKey: 'tier1',
        region: 'South India Corridor',
        lat: 12.9716, lng: 77.5946,
        actualRev: '₹410 Cr',
        potentialRev: '₹430 Cr',
        gapRev: '₹20 Cr (5%)',
        topTherapy: 'NovoPen 6 & Tresiba',
        lacking: [
            'Stockout in Tier-1 Outskirts: Rapid suburban expansion (Whitefield/Electronic City) leads to localized pharmacy stockouts.',
            'App Integration Gap: Doctors demand direct integration of smart pen glucose data into hospital EHRs.'
        ],
        salesParams: {
            'Field Reps Active': '32 Territory Leads',
            'Avg HCP Visit Frequency': '3.4 Visits / Month',
            'Chemist Stocking Rate': '94% Coverage',
            'Prescribing Affinity': '96 / 100 Index'
        },
        marketingParams: {
            'CME Events Hosted': '18 Annual Symposia',
            'Digital Doctor Engagement': '91% Active (Highest in India)',
            'Patient Assistance Program': 'High Connected Pen Pilot',
            'Competitor Pressure': 'Low'
        },
        aiAction: 'Roll out NovoPen 6 smart ecosystem bundle with Tresiba cartridges across major IT corporate healthcare clinics.'
    },
    'lucknow': {
        name: 'Lucknow & Kanpur Growth Hub',
        tier: 'Tier-2 Growth Hub',
        tierKey: 'tier2',
        region: 'North India Corridor',
        lat: 26.8467, lng: 80.9462,
        actualRev: '₹110 Cr',
        potentialRev: '₹150 Cr',
        gapRev: '₹40 Cr (28%)',
        topTherapy: 'Oral GLP-1 (Rybelsus)',
        lacking: [
            'Doctor Coverage Gap: Only 35% of Consulting Physicians and General Practitioners are visited regularly by reps.',
            'Distributor Credit Limits: C&F stockists frequently hit credit caps, delaying product shipments by 2-3 weeks.',
            'Awareness Gap: Doctors continue prescribing legacy sulfonylurea tablets due to habit.'
        ],
        salesParams: {
            'Field Reps Active': '12 Territory Leads (Understaffed)',
            'Avg HCP Visit Frequency': '1.4 Visits / Month (Low)',
            'Chemist Stocking Rate': '68% Coverage',
            'Prescribing Affinity': '64 / 100 Index'
        },
        marketingParams: {
            'CME Events Hosted': '4 Annual Symposia',
            'Digital Doctor Engagement': '42% Active',
            'Patient Assistance Program': 'Low Awareness',
            'Competitor Pressure': 'High (Cheap Oral Sulfonylureas)'
        },
        aiAction: 'Re-allocate 8 field reps from Delhi NCR to Lucknow; extend stockist credit limits to capture +₹40 Cr untapped potential.'
    },
    'jaipur': {
        name: 'Jaipur & Ajmer Growth Hub',
        tier: 'Tier-2 Growth Hub',
        tierKey: 'tier2',
        region: 'North-West Corridor',
        lat: 26.9124, lng: 75.7873,
        actualRev: '₹92 Cr',
        potentialRev: '₹118 Cr',
        gapRev: '₹26 Cr (22%)',
        topTherapy: 'Base Insulin (Tresiba)',
        lacking: [
            'High Price Sensitivity: Patients drop out of Tresiba treatment after 3 months due to out-of-pocket costs.',
            'Cold-Chain Bottlenecks: Stockists during peak summer months (May-June) face refrigerated storage space constraints.'
        ],
        salesParams: {
            'Field Reps Active': '10 Territory Leads',
            'Avg HCP Visit Frequency': '1.8 Visits / Month',
            'Chemist Stocking Rate': '72% Coverage',
            'Prescribing Affinity': '70 / 100 Index'
        },
        marketingParams: {
            'CME Events Hosted': '6 Annual Symposia',
            'Digital Doctor Engagement': '48% Active',
            'Patient Assistance Program': 'Underutilized',
            'Competitor Pressure': 'Moderate'
        },
        aiAction: 'Deploy co-pay patient assistance cards and subsidize solar cold-storage boxes for top 5 Jaipur C&F stockists.'
    },
    'coimbatore': {
        name: 'Coimbatore & Western TN Hub',
        tier: 'Tier-2 Growth Hub',
        tierKey: 'tier2',
        region: 'South India Corridor',
        lat: 11.0168, lng: 76.9558,
        actualRev: '₹140 Cr',
        potentialRev: '₹165 Cr',
        gapRev: '₹25 Cr (15%)',
        topTherapy: 'Premix Insulin (Ryzodeg)',
        lacking: [
            'Under-penetration in Tier-3 Outer Belts: High prescription in main city hospitals, but zero rep coverage in surrounding industrial towns.',
            'SGLT2 Competitor Inroads: Local GPs favoring oral SGLT2 inhibitors over initiating injectable insulins.'
        ],
        salesParams: {
            'Field Reps Active': '14 Territory Leads',
            'Avg HCP Visit Frequency': '2.2 Visits / Month',
            'Chemist Stocking Rate': '84% Coverage',
            'Prescribing Affinity': '82 / 100 Index'
        },
        marketingParams: {
            'CME Events Hosted': '10 Annual Symposia',
            'Digital Doctor Engagement': '65% Active',
            'Patient Assistance Program': 'Moderate Adoption',
            'Competitor Pressure': 'Moderate'
        },
        aiAction: 'Expand field force into Tirupur & Erode satellite belts; run doctor educational workshops on early Ryzodeg initiation.'
    },
    'patna': {
        name: 'Patna & Muzaffarpur Hub',
        tier: 'Tier-2 Growth Hub',
        tierKey: 'tier2',
        region: 'East India Corridor',
        lat: 25.5941, lng: 85.1376,
        actualRev: '₹65 Cr',
        potentialRev: '₹95 Cr',
        gapRev: '₹30 Cr (31%)',
        topTherapy: 'Human Insulin Vials',
        lacking: [
            'Severe Cold-Chain Infra Deficit: Power outages damage temperature-sensitive analog pen cartridges.',
            'Chemist Substitution: Retail chemists pushing generic insulin brands with higher trade margins.'
        ],
        salesParams: {
            'Field Reps Active': '8 Territory Leads',
            'Avg HCP Visit Frequency': '1.2 Visits / Month',
            'Chemist Stocking Rate': '55% Coverage',
            'Prescribing Affinity': '58 / 100 Index'
        },
        marketingParams: {
            'CME Events Hosted': '3 Annual Symposia',
            'Digital Doctor Engagement': '30% Active',
            'Patient Assistance Program': 'Low Adoption',
            'Competitor Pressure': 'High (Generic Vials)'
        },
        aiAction: 'Partner with local cold-chain logistics providers and launch pharmacist compliance programs to prevent generic trade substitution.'
    }
};

// Tab Navigation Logic & Mobile Drawer Toggle
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btnToggleMobile = document.getElementById('btn-toggle-mobile-menu');

    function toggleMobileMenu() {
        if (sidebar && overlay) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }
    }

    function closeMobileMenu() {
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    }

    btnToggleMobile?.addEventListener('click', toggleMobileMenu);
    overlay?.addEventListener('click', closeMobileMenu);

    const titles = {
        'problem-statement': {
            title: 'Interactive Problem Statement',
            sub: 'Bridging the gap between nationwide sales data and localized tier-wise commercial intelligence'
        },
        'geography': {
            title: 'Interactive National Commercial Intelligence Map',
            sub: 'Hover on city nodes for quick stats. Click any Tier-1 or Tier-2 city to open a detailed sales & marketing deep-dive.'
        },
        'dashboard': {
            title: 'Tier-Based Commercial Control Tower',
            sub: 'Automated revenue attribution, market penetration, and launch projections across Tier-1, Tier-2, and Tier-3 India'
        },
        'launch-recommender': {
            title: 'Tier-Based Product Launch Engine',
            sub: 'Propensity-matched rollout planning for novel insulin, GLP-1, and obesity therapies'
        },
        'simulator': {
            title: 'Field Resource Allocator & Simulator',
            sub: 'Simulate re-allocating sales reps and marketing budget between Metros and Tier-2 growth hubs'
        },
        'copilot': {
            title: 'AI Commercial Decision Assistant',
            sub: 'Natural language decision support tailored for executive leadership'
        }
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetEl = document.getElementById(`${targetTab}-tab`);
            if (targetEl) targetEl.classList.add('active');

            if (titles[targetTab]) {
                if (pageTitle) pageTitle.textContent = titles[targetTab].title;
                if (pageSubtitle) pageSubtitle.textContent = titles[targetTab].sub;
            }

            closeMobileMenu();

            if (targetTab === 'geography' && leafletMap) {
                setTimeout(() => { 
                    try { leafletMap.invalidateSize(); } catch(e) {}
                }, 250);
            }
        });
    });

    document.getElementById('btn-goto-map')?.addEventListener('click', () => {
        document.querySelector('[data-tab="geography"]')?.click();
    });

    document.getElementById('btn-view-recommender')?.addEventListener('click', () => {
        document.querySelector('[data-tab="simulator"]')?.click();
    });
}

// 1. Executive Overview Charts
function initOverviewCharts() {
    if (typeof Chart === 'undefined') return;

    try {
        const ctxTier = document.getElementById('tierRevenueChart')?.getContext('2d');
        if (ctxTier) {
            tierChart = new Chart(ctxTier, {
                type: 'bar',
                data: {
                    labels: ['Tier-1 Metros', 'Tier-2 Growth Cities', 'Tier-3 / District Hubs'],
                    datasets: [
                        {
                            label: 'Actual Revenue (Cr)',
                            data: [2073, 1180, 587],
                            backgroundColor: '#001965',
                            borderRadius: 6
                        },
                        {
                            label: 'AI Market Potential (Cr)',
                            data: [2150, 1465, 750],
                            backgroundColor: 'rgba(5, 150, 105, 0.25)',
                            borderColor: '#059669',
                            borderWidth: 1,
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#001965', font: { weight: 'bold' } } },
                        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#475569' } }
                    }
                }
            });
        }

        const ctxPortfolio = document.getElementById('tierPortfolioChart')?.getContext('2d');
        if (ctxPortfolio) {
            portfolioChart = new Chart(ctxPortfolio, {
                type: 'doughnut',
                data: {
                    labels: ['Oral GLP-1 (Rybelsus)', 'Premix Insulins (Ryzodeg/Mix)', 'Base Insulins (Tresiba)', 'Injectable Obesity (Wegovy)', 'Biopharm / Smart Pen'],
                    datasets: [{
                        data: [32, 30, 24, 9, 5],
                        backgroundColor: ['#008bc6', '#001965', '#059669', '#7c3aed', '#d97706'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#0f172a', boxWidth: 12, padding: 12 } }
                    },
                    cutout: '70%'
                }
            });
        }
    } catch (e) {
        console.warn('Overview charts init error:', e);
    }
}

// 2. Interactive India Map & Deep-Dive Module
function initIndiaMapModule() {
    const mapContainer = document.getElementById('india-map-container');
    const selectorList = document.getElementById('city-selector-list');
    const deepDiveCard = document.getElementById('city-deep-dive');
    const btnCloseDeepDive = document.getElementById('btn-close-deep-dive');

    if (!mapContainer || typeof L === 'undefined') return;

    try {
        // Initialize Leaflet Map centered on India
        leafletMap = L.map('india-map-container', {
            center: [21.5937, 78.9629],
            zoom: 5,
            zoomControl: true
        });

        // Light CartoDB Voyager Map Tiles for Corporate White Theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 18
        }).addTo(leafletMap);

        // Populate City Selector Chips Bar below Map
        if (selectorList) {
            selectorList.innerHTML = Object.keys(citiesDatabase).map(key => {
                const c = citiesDatabase[key];
                return `
                    <button class="city-chip-btn" data-city-key="${key}">
                        <span class="pulse-marker ${c.tierKey === 'tier1' ? 'green' : 'amber'}"></span>
                        <span>${c.name.split(' ')[0]} (${c.actualRev})</span>
                    </button>
                `;
            }).join('');
        }

        // Function to render Deep-Dive Page/Drawer for selected city
        function renderCityDeepDive(cityKey) {
            const c = citiesDatabase[cityKey];
            if (!c || !deepDiveCard) return;

            document.getElementById('dd-city-name').textContent = c.name;
            document.getElementById('dd-city-tier').textContent = c.tier;
            document.getElementById('dd-city-tier').className = `badge ${c.tierKey === 'tier1' ? 'green' : 'amber'}`;
            document.getElementById('dd-city-region').textContent = `• ${c.region}`;

            document.getElementById('dd-rev-actual').textContent = c.actualRev;
            document.getElementById('dd-rev-potential').textContent = c.potentialRev;
            document.getElementById('dd-rev-gap').textContent = c.gapRev;
            document.getElementById('dd-top-therapy').textContent = c.topTherapy;

            // Render What is Lacking List
            document.getElementById('dd-lacking-list').innerHTML = c.lacking.map(item => `
                <li><i data-lucide="x-circle" style="color:#e11d48; flex-shrink:0; margin-top:2px;"></i> <span>${item}</span></li>
            `).join('');

            // Render Sales Parameters
            document.getElementById('dd-sales-params').innerHTML = Object.keys(c.salesParams).map(k => `
                <div class="param-item">
                    <span class="param-label">${k}</span>
                    <span class="param-val">${c.salesParams[k]}</span>
                </div>
            `).join('');

            // Render Marketing Parameters
            document.getElementById('dd-marketing-params').innerHTML = Object.keys(c.marketingParams).map(k => `
                <div class="param-item">
                    <span class="param-label">${k}</span>
                    <span class="param-val">${c.marketingParams[k]}</span>
                </div>
            `).join('');

            // Render AI Action Box
            document.getElementById('dd-ai-action').innerHTML = `
                <p><strong><i data-lucide="sparkles"></i> AI Prescriptive Recommendation:</strong> ${c.aiAction}</p>
            `;

            deepDiveCard.style.display = 'block';
            deepDiveCard.scrollIntoView({ behavior: 'smooth' });

            if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();

            // Highlight selected button
            document.querySelectorAll('.city-chip-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-city-key') === cityKey);
            });
        }

        // Add Markers to Leaflet Map for each City
        Object.keys(citiesDatabase).forEach(key => {
            const c = citiesDatabase[key];
            const isTier1 = c.tierKey === 'tier1';

            const markerColor = isTier1 ? '#059669' : '#d97706';
            const markerRadius = isTier1 ? 12 : 9;

            const circleMarker = L.circleMarker([c.lat, c.lng], {
                radius: markerRadius,
                fillColor: markerColor,
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.85
            }).addTo(leafletMap);

            // Hover Tooltip Popup Content
            const tooltipContent = `
                <div class="map-hover-tooltip">
                    <h4>${c.name} <span class="badge ${isTier1 ? 'green' : 'amber'}">${c.tier}</span></h4>
                    <p><strong>Actual Revenue:</strong> ${c.actualRev} | <strong>Target:</strong> ${c.potentialRev}</p>
                    <p><strong>Revenue Gap:</strong> <span style="color:#e11d48; font-weight:700;">${c.gapRev}</span></p>
                    <p><strong>Top Product:</strong> ${c.topTherapy}</p>
                    <span class="click-hint">👉 Click for full Sales, Marketing & Bottleneck Deep-Dive</span>
                </div>
            `;

            circleMarker.bindTooltip(tooltipContent, {
                direction: 'top',
                offset: [0, -10],
                opacity: 1
            });

            // Click Event -> Render Deep-Dive Page
            circleMarker.on('click', () => {
                renderCityDeepDive(key);
            });
        });

        // Handle Sidebar City Select Clicks
        document.querySelectorAll('.city-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-city-key');
                renderCityDeepDive(key);
                const c = citiesDatabase[key];
                if (c && leafletMap) {
                    leafletMap.flyTo([c.lat, c.lng], 8, { duration: 1.2 });
                }
            });
        });

        btnCloseDeepDive?.addEventListener('click', () => {
            if (deepDiveCard) deepDiveCard.style.display = 'none';
        });

        // Default select Lucknow on load
        renderCityDeepDive('lucknow');
    } catch (e) {
        console.warn('Map module init error:', e);
    }
}

// 3. Product Launch Engine by Tier
const launchData = {
    'icodec': {
        labels: ['Tier-1 Metros', 'Tier-2 Growth', 'Tier-3 Hubs'],
        scores: [95, 84, 45],
        timeline: [
            { phase: 'Phase 1: Months 1-3', title: 'Tier-1 Metro Endocrinologists', desc: 'Launch across top 1,500 key endocrinologists in Delhi NCR, Mumbai & Bengaluru.' },
            { phase: 'Phase 2: Months 4-6', title: 'Tier-2 Regional Hospital Networks', desc: 'Expand to Lucknow, Jaipur, Coimbatore & Indore private nursing homes.' },
            { phase: 'Phase 3: Months 7-12', title: 'Tier-3 Cold-Chain Distributors', desc: 'Roll out to tier-3 C&F hubs with validated solar cold-storage logistics.' }
        ]
    },
    'wegovy': {
        labels: ['Tier-1 Metros', 'Tier-2 Growth', 'Tier-3 Hubs'],
        scores: [98, 72, 25],
        timeline: [
            { phase: 'Phase 1: Months 1-3', title: 'Tier-1 Lifestyle & Bariatric Clinics', desc: 'Focus strictly on high-purchasing power centers in NCR, Mumbai & Bengaluru.' },
            { phase: 'Phase 2: Months 4-6', title: 'Tier-2 Metro Outskirts', desc: 'Selective launch in Jaipur, Surat & Chandigarh corporate centers.' }
        ]
    },
    'rybelsus-high': {
        labels: ['Tier-1 Metros', 'Tier-2 Growth', 'Tier-3 Hubs'],
        scores: [88, 94, 60],
        timeline: [
            { phase: 'Phase 1: Months 1-3', title: 'Tier-2 High-Growth Expansion', desc: 'Target 2,500 General Physicians in Lucknow, Coimbatore, Patna & Indore.' },
            { phase: 'Phase 2: Months 4-6', title: 'Tier-1 Combination Prescriptions', desc: 'Position as add-on therapy for uncontrolled patients on Metformin.' }
        ]
    },
    'novopen': {
        labels: ['Tier-1 Metros', 'Tier-2 Growth', 'Tier-3 Hubs'],
        scores: [92, 65, 30],
        timeline: [
            { phase: 'Phase 1: Months 1-3', title: 'Tier-1 Tech-Savvy Patient Pilot', desc: 'Bundle NovoPen 6 with Tresiba/Ryzodeg cartridges in Metro hospital pharmacies.' }
        ]
    }
};

function initLaunchModule() {
    const selectProduct = document.getElementById('launch-product-select');
    const btnRun = document.getElementById('btn-run-launch-ai');
    const timelineContainer = document.getElementById('rollout-timeline');

    function updateLaunchView() {
        const prodKey = selectProduct ? selectProduct.value : 'icodec';
        const data = launchData[prodKey];
        if (!data) return;

        if (timelineContainer) {
            timelineContainer.innerHTML = data.timeline.map(t => `
                <div class="timeline-step">
                    <span class="timeline-phase">${t.phase}</span>
                    <h4 class="timeline-title">${t.title}</h4>
                    <p class="timeline-desc">${t.desc}</p>
                </div>
            `).join('');
        }

        if (typeof Chart === 'undefined') return;

        try {
            const ctx = document.getElementById('launchTierChart')?.getContext('2d');
            if (ctx) {
                if (launchChart) launchChart.destroy();
                launchChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'AI Tier Launch Affinity Score (0-100)',
                            data: data.scores,
                            backgroundColor: ['#001965', '#d97706', '#e11d48'],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#475569' } },
                            x: { grid: { display: false }, ticks: { color: '#001965', font: { weight: 'bold' } } }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        } catch (e) {
            console.warn('Launch chart error:', e);
        }
    }

    btnRun?.addEventListener('click', updateLaunchView);
    selectProduct?.addEventListener('change', updateLaunchView);
    updateLaunchView();
}

// 4. Simulator Module
function initSimulatorModule() {
    const sField = document.getElementById('slider-field-shift');
    const sHcp = document.getElementById('slider-hcp-marketing');
    const sDist = document.getElementById('slider-distributor-incentive');

    const vField = document.getElementById('val-field-shift');
    const vHcp = document.getElementById('val-hcp-marketing');
    const vDist = document.getElementById('val-distributor-incentive');

    const netBadge = document.getElementById('sim-net-badge');
    const roiVal = document.getElementById('sim-roi-val');

    function updateSimulation() {
        const fieldVal = sField ? parseInt(sField.value) : 15;
        const hcpVal = sHcp ? parseInt(sHcp.value) : 20;
        const distVal = sDist ? parseInt(sDist.value) : 10;

        if (vField) vField.textContent = (fieldVal > 0 ? '+' : '') + fieldVal + '%';
        if (vHcp) vHcp.textContent = '+' + hcpVal + '%';
        if (vDist) vDist.textContent = '+' + distVal + '%';

        const netDelta = (fieldVal * 5.2) + (hcpVal * 4.8) + (distVal * 3.5);
        const roundedDelta = Math.round(netDelta);

        if (netBadge) netBadge.textContent = `${roundedDelta >= 0 ? '+' : ''}₹${roundedDelta} Cr Projected Revenue Delta`;
        if (roiVal) roiVal.textContent = (3.5 + (hcpVal * 0.04)).toFixed(1) + 'x';

        if (typeof Chart === 'undefined') return;

        try {
            const ctx = document.getElementById('simulationChart')?.getContext('2d');
            if (ctx) {
                const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
                const baseline = [320, 322, 325, 328, 330, 332, 335, 338, 340, 342, 345, 348];
                const simulated = baseline.map((b, idx) => Math.round(b + (roundedDelta / 12) * (idx + 1) * 0.22));

                if (simChart) simChart.destroy();
                simChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [
                            {
                                label: 'Tier-2 Shift Strategy Trajectory',
                                data: simulated,
                                borderColor: '#059669',
                                backgroundColor: 'rgba(5, 150, 105, 0.08)',
                                fill: true,
                                tension: 0.3
                            },
                            {
                                label: 'Baseline Projection (Current Allocation)',
                                data: baseline,
                                borderColor: '#64748b',
                                borderDash: [5, 5],
                                tension: 0.3
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#475569' } },
                            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#475569' } }
                        },
                        plugins: { legend: { labels: { color: '#001965' } } }
                    }
                });
            }
        } catch (e) {
            console.warn('Simulation chart error:', e);
        }
    }

    [sField, sHcp, sDist].forEach(input => input?.addEventListener('input', updateSimulation));
    document.getElementById('btn-recalculate-sim')?.addEventListener('click', updateSimulation);

    updateSimulation();
}

// 5. Upgraded Smart AI Copilot Module
function initCopilotModule() {
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send-chat');
    const messagesBox = document.getElementById('chat-messages');
    const chips = document.querySelectorAll('.query-chip');

    function appendMessage(sender, text) {
        if (!messagesBox) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = `
            <div class="avatar"><i data-lucide="${sender === 'user' ? 'user' : 'bot'}"></i></div>
            <div class="bubble">${text}</div>
        `;
        messagesBox.appendChild(msgDiv);
        messagesBox.scrollTop = messagesBox.scrollHeight;
        if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
    }

    function generateIntelligentResponse(userText) {
        const q = userText.toLowerCase();

        if (q.includes('lucknow') || q.includes('kanpur') || (q.includes('increase') && q.includes('sales'))) {
            return `<strong>[Lucknow Commercial Strategy]</strong>: To increase revenue in Lucknow & Kanpur (+₹40 Cr gap), AI recommends:
            <ol>
                <li><strong>Re-allocate 8 Field Reps</strong> from saturated Delhi NCR to cover 65% of unvisited General Physicians.</li>
                <li><strong>Extend Stockist Credit Limits</strong> at top 3 C&F hubs to prevent 2-week order fulfillment delays.</li>
                <li><strong>CME Workshops on Rybelsus</strong>: Focus on initiating oral GLP-1 as early add-on therapy for uncontrolled patients on Metformin.</li>
            </ol>`;
        }
        
        if (q.includes('rybelsus') || q.includes('flattening') || q.includes('oral glp')) {
            return `<strong>[Oral GLP-1 Analysis]</strong>: Rybelsus growth in Tier-1 Metros is slowing to +4% YoY due to competition from cheap DPP-4/SGLT2 inhibitors. However, <strong>Tier-2 Growth Cities (Lucknow, Jaipur, Coimbatore) show +28% uncaptured demand</strong>. Re-targeting Tier-2 physicians will drive next phase growth.`;
        }

        if (q.includes('tresiba') || q.includes('ryzodeg') || q.includes('south') || q.includes('insulin')) {
            return `<strong>[South India Insulin Analysis]</strong>: In South India (TN, Kerala, Karnataka), Ryzodeg premix insulin has <strong>+22% YoY adoption</strong> due to strong endocrinologist presence. Tresiba basal insulin leads in Tier-1 Metros. In Tier-2 cities like Coimbatore, expanding rep coverage into industrial outskirts will capture +₹25 Cr.`;
        }

        if (q.includes('wegovy') || q.includes('obesity') || q.includes('launch')) {
            return `<strong>[Wegovy Anti-Obesity Rollout]</strong>: AI predicts <strong>98/100 Fit Score</strong> for Phase 1 launch in Tier-1 Metros (NCR, Mumbai, Bengaluru). We recommend partnering with top metabolic & bariatric surgery centers in South Mumbai and South Delhi before expanding to Tier-2 hubs in Month 6.`;
        }

        if (q.includes('icodec') || q.includes('weekly') || q.includes('6-month')) {
            return `<strong>[Icodec Once-Weekly Insulin Forecast]</strong>: Projected 6-month demand for Icodec across Tier-2 hubs is <strong>88,000 FlexTouch pens</strong>. Rollout strategy: Start Tier-1 Metro endocrinologists in Month 1, then expand to Tier-2 regional hospitals in Month 4.`;
        }

        if (q.includes('cold-chain') || q.includes('stockout') || q.includes('tier-3')) {
            return `<strong>[Cold-Chain Logistics Solution]</strong>: To eliminate summer power outage stockouts in Tier-3 district towns, Novo Nordisk should subsidize <strong>solar-assisted 2°C-8°C cold boxes</strong> at top 15 regional carrying & forwarding (C&F) stockists.`;
        }

        if (q.includes('problem statement') || q.includes('challenge') || q.includes('what is the problem')) {
            return `<strong>[Core Problem Statement]</strong>: "Novo Nordisk India lacks an automated data intelligence layer to understand tier-wise sales performance—leaving commercial teams reliant on manual Excel projections to decide which products to launch in Tier-2 vs Tier-1 cities, and how to allocate sales reps to capture revenue gaps."`;
        }

        if (q.includes('tier-2') || q.includes('top 5') || q.includes('untapped')) {
            return `<strong>[Top 5 Tier-2 Growth Opportunities]</strong>:
            <ol>
                <li><strong>Lucknow & Kanpur</strong>: ₹40 Cr Gap (Doctor Coverage Bottleneck)</li>
                <li><strong>Patna & Muzaffarpur</strong>: ₹30 Cr Gap (Cold-Chain & Generic Substitution)</li>
                <li><strong>Jaipur & Ajmer</strong>: ₹26 Cr Gap (Price Sensitivity & Stockist Credit)</li>
                <li><strong>Coimbatore</strong>: ₹25 Cr Gap (Tier-3 Outer Belt Coverage)</li>
                <li><strong>Indore & Ujjain</strong>: ₹18 Cr Gap (Doctor CME Gap)</li>
            </ol>`;
        }

        return `<strong>[NovoIntel AI Commercial Assistant]</strong>: Based on our spatial market intelligence engine for India, Novo Nordisk can capture an additional <strong>+₹214 Cr</strong> in FY27 by shifting 15% of sales rep capacity from saturated Tier-1 Metros to fast-growing Tier-2 hubs like Lucknow, Jaipur, and Coimbatore. Ask me specific questions about city performance, Rybelsus, Tresiba, Wegovy, or cold-chain logistics!`;
    }

    function handleSend(userText) {
        if (!userText || !userText.trim()) return;
        appendMessage('user', userText);
        if (chatInput) chatInput.value = '';

        const reply = generateIntelligentResponse(userText);

        setTimeout(() => {
            appendMessage('ai', reply);
        }, 400);
    }

    btnSend?.addEventListener('click', () => handleSend(chatInput ? chatInput.value : ''));
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend(chatInput.value);
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            handleSend(chip.textContent);
        });
    });
}
