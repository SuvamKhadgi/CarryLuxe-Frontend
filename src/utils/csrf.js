// CSRF Token Management Utility
let csrfToken = null;

/**
 * Fetches a CSRF token from the backend
 * @returns {Promise<string>} The CSRF token
 */
export const fetchCSRFToken = async () => {
    try {
        // console.log('Attempting to fetch CSRF token...');

        const response = await fetch('https://localhost:3000/api/csrf-token', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // console.log('CSRF token response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            // console.error('CSRF token fetch failed:', errorText);
            throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('CSRF token received:', data.csrfToken ? 'Yes' : 'No');

        csrfToken = data.csrfToken;
        return csrfToken;
    } catch (error) {
        // console.error('Error fetching CSRF token:', error);

        // Additional debugging info
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            // console.error('This is likely a network connectivity issue. Possible causes:');
            // console.error('1. Backend server is not running on https://localhost:3000');
            // console.error('2. CORS configuration issues');
            // console.error('3. SSL certificate is being rejected by the browser');
            // console.error('4. Network firewall blocking the request');
        }

        throw error;
    }
};

/**
 * Gets the current CSRF token, fetching it if needed
 * @returns {Promise<string|null>} The CSRF token or null if unavailable
 */
export const getCSRFToken = async () => {
    if (!csrfToken) {
        try {
            return await fetchCSRFToken();
        } catch (error) {
            // console.warn('CSRF token not available:', error.message);
            return null;
        }
    }
    return csrfToken;
};

/**
 * Clears the stored CSRF token (useful on logout or token expiry)
 */
export const clearCSRFToken = () => {
    csrfToken = null;
};

/**
 * Refreshes the CSRF token by clearing and fetching a new one
 * @returns {Promise<string>} The new CSRF token
 */
export const refreshCSRFToken = async () => {
    clearCSRFToken();
    return await fetchCSRFToken();
};

/**
 * Checks if a CSRF token is currently stored
 * @returns {boolean} True if token exists, false otherwise
 */
export const hasCSRFToken = () => {
    return !!csrfToken;
};
