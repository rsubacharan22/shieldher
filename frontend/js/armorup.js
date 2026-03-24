async function loadThreats() {
    const threats = await apiGet('/api/threats');
    const container = document.getElementById('threat-feed-container');
    
    if (!threats || threats.length === 0) {
        container.innerHTML = '<p class="text-3">No threats detected.</p>';
        return;
    }

    container.innerHTML = threats.map(threat => `
        <div class="card threat-card">
            <div class="threat-header">
                <span class="pill pill-${threat.severity.toLowerCase()}">${threat.severity}</span>
                <span class="text-3">${threat.platform}</span>
            </div>
            <p class="threat-content">${threat.content}</p>
            <button class="btn-secondary btn-sm" onclick="resolveThreat('${threat.id}')">Mark Resolved</button>
        </div>
    `).join('');
}

async function resolveThreat(id) {
    showToast('Marking as resolved...');
    await apiPut(`/api/threats/${id}/resolve`);
    loadThreats();
}

// Initialize
loadThreats();