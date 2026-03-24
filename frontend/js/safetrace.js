/**
 * SHIELDHER — SafeTrace Logic
 * Manages the 4-step scan-to-removal flow.
 */

let currentStep = 1;
let scanInterval;

// Step 3 Data (Mocked for Chart)
const riskData = [
    { label: 'Location', value: 85, color: '#991B1B' }, // Red
    { label: 'Contact', value: 60, color: '#92400E' },  // Amber
    { label: 'Creds', value: 30, color: '#1E40AF' },    // Blue
    { label: 'Financial', value: 5, color: '#2D6A4F' }  // Green
];

/**
 * Step Navigation
 */
function goToStep(stepNum) {
    // Hide all sections
    document.querySelectorAll('.trace-section').forEach(s => s.classList.add('hidden'));
    // Show target section
    document.getElementById(`trace-step-${stepNum}`).classList.remove('hidden');
    
    // Update Pills
    document.querySelectorAll('.step').forEach((pill, idx) => {
        pill.classList.remove('active', 'done');
        if (idx + 1 < stepNum) pill.classList.add('done');
        if (idx + 1 === stepNum) pill.classList.add('active');
    });

    currentStep = stepNum;

    // Trigger specific logic per step
    if (stepNum === 1) startScanSequence();
    if (stepNum === 3) drawRiskChart();
}

/**
 * STEP 1: Scan Animation Logic
 */
function startScanSequence() {
    let count = 0;
    const countEl = document.getElementById('sources-checked');
    const btn = document.getElementById('btn-view-results');
    
    // Categories to "check"
    const categories = [
        'People-search sites',
        'Data aggregators',
        'Dark web dumps',
        'Paste sites',
        'Social brokers'
    ];

    const catContainer = document.getElementById('scan-categories');
    catContainer.innerHTML = categories.map(cat => `
        <div class="cat-item">
            <div class="cat-dot"></div>
            <span>${cat}</span>
        </div>
    `).join('');

    const dots = catContainer.querySelectorAll('.cat-dot');

    scanInterval = setInterval(() => {
        count++;
        countEl.innerText = count;

        // Animate dots based on progress
        const stepThreshold = Math.floor(47 / categories.length);
        const currentCatIdx = Math.floor(count / stepThreshold);
        
        if (dots[currentCatIdx]) {
            dots[currentCatIdx].className = 'cat-dot checking';
            if (currentCatIdx > 0) dots[currentCatIdx - 1].className = 'cat-dot done';
        }

        if (count >= 47) {
            clearInterval(scanInterval);
            dots[dots.length - 1].className = 'cat-dot done';
            btn.innerText = 'View Results →';
            btn.disabled = false;
            btn.onclick = () => goToStep(2);
        }
    }, 50); // Speed of scan
}

/**
 * STEP 3: Native Canvas Chart
 */
function drawRiskChart() {
    const canvas = document.getElementById('riskChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear and Setup
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 40;
    const barHeight = 25;
    const gap = 20;

    riskData.forEach((item, i) => {
        const y = padding + (i * (barHeight + gap));
        const maxWidth = canvas.width - (padding * 2);
        const barWidth = (item.value / 100) * maxWidth;

        // Draw Bar Background
        ctx.fillStyle = '#E5E2DB';
        ctx.roundRect(padding, y, maxWidth, barHeight, 5);
        ctx.fill();

        // Draw Active Bar
        ctx.beginPath();
        ctx.fillStyle = item.color;
        ctx.roundRect(padding, y, barWidth, barHeight, 5);
        ctx.fill();

        // Draw Label
        ctx.fillStyle = '#1A1917';
        ctx.font = '12px DM Sans';
        ctx.fillText(`${item.label} (${item.value}%)`, padding, y - 5);
    });
}

/**
 * STEP 4: Removal Requests
 */
document.getElementById('btn-remove-all')?.addEventListener('click', async function() {
    const btn = this;
    btn.disabled = true;
    btn.innerText = 'Sending Requests...';

    // Mocking the stagger delay for effect
    await new Promise(r => setTimeout(r, 1500));
    
    showToast('All removal requests sent successfully.');
    btn.innerText = '✓ Requests Sent';
    
    // Add "Back to Home" link
    const backLink = document.createElement('button');
    backLink.className = 'btn-secondary';
    backLink.style.marginTop = '10px';
    backLink.innerText = 'Return to Dashboard';
    backLink.onclick = () => window.location.href = 'index.html';
    btn.parentNode.appendChild(backLink);
});

// Initialize
window.onload = () => {
    goToStep(1);
};