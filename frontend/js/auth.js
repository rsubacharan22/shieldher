(function checkAuth() {
    const token = localStorage.getItem('shieldher_token');
    const isAuthPage = window.location.pathname.includes('onboarding.html');

    if (!token && !isAuthPage) {
        window.location.href = 'onboarding.html';
    } else if (token && isAuthPage) {
        window.location.href = 'index.html';
    }
})();