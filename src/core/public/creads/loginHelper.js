import axios from 'axios';
import { refreshCSRFToken } from '../../../utils/csrf';

/**
 * Utility to refresh CSRF token after successful login
 * This should be called after any authentication operation
 */
export const handlePostLoginCSRF = async () => {
    try {
        console.log('Refreshing CSRF token after login...');
        await refreshCSRFToken();
        console.log('CSRF token refreshed successfully');
        return true;
    } catch (error) {
        console.error('Failed to refresh CSRF token after login:', error);
        // Don't throw error as this is not critical for login success
        return false;
    }
};

/**
 * Enhanced login mutation that handles CSRF token refresh
 */
export const performLogin = async (loginData) => {
    try {
        // Perform login
        const response = await axios.post('https://localhost:3000/api/creds/login', loginData);

        // If login successful, refresh CSRF token for future requests
        if (response.status === 200 || response.status === 201) {
            console.log('Login successful, refreshing CSRF token...');
            await handlePostLoginCSRF();
        }

        return response;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};
