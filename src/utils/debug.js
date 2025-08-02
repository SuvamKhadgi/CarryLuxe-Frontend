// Debugging utility to test backend connectivity
// Run this in the browser console to test if the backend is accessible

export const testBackendConnectivity = async () => {
    // console.log(' Testing backend connectivity...');

    try {
        // Test health endpoint first
        // console.log('1. Testing health endpoint...');
        const healthResponse = await fetch('https://localhost:3000/api/health', {
            method: 'GET',
            credentials: 'include',
        });

        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            // console.log(' Health check passed:', healthData);
        } else {
            // console.log(' Health check failed:', healthResponse.status, healthResponse.statusText);
        }
    } catch (error) {
        // console.log(' Health check error:', error.message);
    }

    try {
        // Test CSRF token endpoint
        // console.log('2. Testing CSRF token endpoint...');
        const csrfResponse = await fetch('https://localhost:3000/api/csrf-token', {
            method: 'GET',
            credentials: 'include',
        });

        if (csrfResponse.ok) {
            const csrfData = await csrfResponse.json();
            // console.log('✅ CSRF token received:', csrfData);
        } else {
            const errorText = await csrfResponse.text();
            // console.log('❌ CSRF token failed:', csrfResponse.status, errorText);
        }
    } catch (error) {
        // console.log('❌ CSRF token error:', error.message);
    }

    // console.log('🏁 Testing complete');
};

// Auto-run this function when the module loads (for debugging)
// Uncomment the line below to auto-test
// testBackendConnectivity();
