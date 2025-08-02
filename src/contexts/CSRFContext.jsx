import { createContext, useContext, useEffect, useState } from 'react';
import { clearCSRFToken, fetchCSRFToken } from '../utils/csrf';

const CSRFContext = createContext();

export const useCSRF = () => {
    const context = useContext(CSRFContext);
    if (!context) {
        throw new Error('useCSRF must be used within a CSRFProvider');
    }
    return context;
};

export const CSRFProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    const initializeCSRF = async () => {
        try {
            await fetchCSRFToken();
            setIsInitialized(true);
            setError(null);
            // console.log('CSRF token initialized successfully');
        } catch (err) {
            // console.warn('Failed to initialize CSRF token:', err);
            setError(err);
            setIsInitialized(true); // Still set to true to prevent infinite loading

            // Log additional debugging info
            // console.warn('This might be due to:');
            // console.warn('1. Backend server not running');
            // console.warn('2. CORS configuration issues');
            // console.warn('3. CSRF middleware configuration issues');
            // console.warn('The app will continue to work, but CSRF protection may be disabled for some requests');
        }
    };

    const refreshCSRF = async () => {
        try {
            clearCSRFToken();
            await fetchCSRFToken();
            setError(null);
            return true;
        } catch (err) {
            // console.error('Failed to refresh CSRF token:', err);
            setError(err);
            return false;
        }
    };

    useEffect(() => {
        initializeCSRF();
    }, []);

    const value = {
        isInitialized,
        error,
        refreshCSRF,
        initializeCSRF,
    };

    return (
        <CSRFContext.Provider value={value}>
            {children}
        </CSRFContext.Provider>
    );
};
