import { clearCSRFToken, getCSRFToken } from './csrf';

/**
 * Enhanced fetch wrapper with automatic CSRF token handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} The fetch response
 */
export const fetchWithCSRF = async (url, options = {}) => {
    const config = {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    // Add CSRF token for non-GET requests
    if (config.method && config.method.toLowerCase() !== 'get') {
        try {
            const csrfToken = await getCSRFToken();
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
                console.log('CSRF token added to fetch request');
            } else {
                console.warn('No CSRF token available for fetch request');
            }
        } catch (error) {
            console.warn('Failed to get CSRF token for fetch, proceeding without it:', error.message);
            // Continue with the request even if CSRF token is not available
        }
    }

    try {
        const response = await fetch(url, config);

        // Handle CSRF token errors
        if (response.status === 403) {
            const responseData = await response.clone().json().catch(() => ({}));
            if (responseData.error === 'CSRF_TOKEN_MISMATCH') {
                console.log('CSRF token mismatch in fetch, attempting retry...');
                // Clear the stored token and try again
                clearCSRFToken();
                try {
                    const newToken = await getCSRFToken();
                    if (newToken) {
                        config.headers['X-CSRF-Token'] = newToken;
                        console.log('Retrying fetch with new CSRF token');
                        return await fetch(url, config);
                    }
                } catch (retryError) {
                    console.error('Failed to retry fetch request with new CSRF token:', retryError);
                    throw retryError;
                }
            }
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

/**
 * POST request with CSRF protection
 * @param {string} url - The URL to post to
 * @param {Object} data - The data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>} The fetch response
 */
export const postWithCSRF = async (url, data, options = {}) => {
    return fetchWithCSRF(url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
    });
};

/**
 * PUT request with CSRF protection
 * @param {string} url - The URL to put to
 * @param {Object} data - The data to send
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>} The fetch response
 */
export const putWithCSRF = async (url, data, options = {}) => {
    return fetchWithCSRF(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options,
    });
};

/**
 * DELETE request with CSRF protection
 * @param {string} url - The URL to delete
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Response>} The fetch response
 */
export const deleteWithCSRF = async (url, options = {}) => {
    return fetchWithCSRF(url, {
        method: 'DELETE',
        ...options,
    });
};
