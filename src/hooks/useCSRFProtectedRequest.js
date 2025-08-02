import { useCallback, useState } from 'react';
import { useCSRF } from '../contexts/CSRFContext';
import { getCSRFToken } from '../utils/csrf';

/**
 * Custom hook for managing CSRF-protected API calls
 * @returns {Object} Object containing CSRF utilities and state
 */
export const useCSRFProtectedRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { refreshCSRF } = useCSRF();

    /**
     * Makes a CSRF-protected request with automatic retry on token failure
     * @param {Function} requestFn - Function that makes the API call
     * @param {Object} options - Options for the request
     * @returns {Promise} The response from the API call
     */
    const makeRequest = useCallback(async (requestFn, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Get CSRF token
            const csrfToken = await getCSRFToken();

            // Make the request
            const response = await requestFn(csrfToken);

            return response;
        } catch (err) {
            // Handle CSRF token errors specifically
            if (err.response?.status === 403 &&
                err.response?.data?.error === 'CSRF_TOKEN_MISMATCH') {

                if (options.autoRetry !== false) {
                    try {
                        // Refresh CSRF token and retry
                        await refreshCSRF();
                        const newToken = await getCSRFToken();
                        const retryResponse = await requestFn(newToken);
                        return retryResponse;
                    } catch (retryErr) {
                        setError(retryErr);
                        throw retryErr;
                    }
                }
            }

            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [refreshCSRF]);

    /**
     * Clears any stored error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        makeRequest,
        clearError,
        refreshCSRF,
    };
};
