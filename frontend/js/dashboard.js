/**
 * SHIELDHER — Dashboard Logic
 * Handles risk score rendering and activity feed.
 */

async function initDashboard() {
    try {
        // 1. Fetch core user data (Risk Score, Stats)
        // Endpoint returns: { name, risk_score, exposures, threats, removed }
        const userData = await apiGet('/api/user/profile');
        
        if (userData) {
            updateUI(userData);
        }

        // 2. Fetch recent threats for the activity feed
        const threats = await apiGet('/api/threats');
        
        if (threats && threats.length > 0) {
            renderActivityFeed(threats.slice(0, 4)); // Show only latest 4
        } else {
            document.getElementById('alerts-list').innerHTML = `
                <p class="text-3" style="text-align:center; padding:20px;">No recent alerts.</p>
            `;
        }

    } catch (error) {
        console.error("Dashboard Load Error:", error);
        showToast("Failed to sync dashboard data.");
    }
}

/**
 * Updates the top cards and greeting
 */
function updateUI(data) {
    // Update Greeting
    const greeting = document.getElementById('greeting-text');
    if (data.name) greeting.innerText = `Good morning, ${data.name.split(' ')[0]}`;

    // Update Risk Score and Progress Bar
    const scoreEl = document.getElementById('risk-score');
    const barEl = document.getElementById('score-bar');
    
    if (scoreEl && barEl) {
        scoreEl.innerText = data.risk_score || 0;
        barEl.style.width = `${data.risk_score || 0}%`;
    }

    // Update Mini Stats
    document.getElementById('stat-exposures').innerText = data.exposures || 0;
    document.getElementById('stat-threats').innerText = data.threats || 0;
    document.getElementById('stat-removed').innerText = data.removed || 0;
}

/**
 * Renders the list of recent alerts
 */
function renderActivityFeed(alerts) {
    const list = document.getElementById('alerts-list');
    
    list.innerHTML = alerts.map(alert => {
        // Map severity to correct pill class
        const sevClass = alert.severity.toLowerCase(); 
        
        return `
            <div class="alert-item" style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border);">
                <span class="dot" style="width: 8px; height: 8px; border-radius: 50%; background: var(--${sevClass});"></span>
                <div class="alert-info" style="flex: 1;">
                    <strong style="display: block; font-size: 14px;">${alert.type}</strong>
                    <span class="text-3" style="font-size: 12px;">${alert.platform}</span>
                </div>
                <span class="pill pill-${sevClass}">${alert.severity}</span>
            </div>
        `;
    }).join('');
}

// Kick off the load
initDashboard();