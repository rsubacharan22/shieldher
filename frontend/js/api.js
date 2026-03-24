const API_BASE = 'http://localhost:3000';

async function apiFetch(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('shieldher_token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (response.status === 401) {
            localStorage.removeItem('shieldher_token');
            window.location.href = 'onboarding.html';
        }
        return await response.json();
    } catch (error) {
        showToast('Connection error. Check backend.');
        console.error(error);
    }
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}