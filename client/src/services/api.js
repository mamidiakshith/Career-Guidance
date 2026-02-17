import axios from 'axios';
import axiosRetry from 'axios-retry';
import config from '../config';
import { triggerServerWakingUp, triggerServerReady } from '../utils/serverAwakeEvent';

// Create Axios instance
const api = axios.create({
    baseURL: config.API_URL,
    timeout: 30000, // 30 seconds timeout to allow for cold starts if they just hang
    headers: {
        'Content-Type': 'application/json',
    },
});

// Configure retry behavior
axiosRetry(api, {
    retries: 3, // Retry 3 times
    retryDelay: (retryCount) => {
        // Exponential backoff: 1s, 2s, 4s
        console.log(`Retry attempt: ${retryCount}`);
        return axiosRetry.exponentialDelay(retryCount);
    },
    retryCondition: (error) => {
        // Retry on network errors or 5xx status codes
        // Also retry on strict timeouts if the server is sleeping
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            (error.response && error.response.status >= 500);
    },
    onRetry: (retryCount, error, requestConfig) => {
        // Trigger the "Server Waking Up" message on the first retry
        if (retryCount === 1) {
            console.log('Server might be sleeping. Triggering wake-up message...');
            triggerServerWakingUp();
        }
    }
});

// Request interceptor to handle long-running requests (server sleeping)
api.interceptors.request.use(config => {
    // Set a timeout to trigger the message if the request takes too long (e.g., 3s)
    // We attach the timer ID to the config so we can clear it in response
    config.metadata = { startTime: new Date() };
    config.slowRequestTimer = setTimeout(() => {
        console.log('Request taking longer than 3s, server might be sleeping...');
        triggerServerWakingUp();
    }, 3000);
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Clear the slow request timer
        if (response.config.slowRequestTimer) {
            clearTimeout(response.config.slowRequestTimer);
        }

        // If we get a success response, the server is ready
        triggerServerReady();
        return response.data; // Return data directly to match fetch().json() behavior partially
    },
    (error) => {
        // Clear timer on error too
        if (error.config && error.config.slowRequestTimer) {
            clearTimeout(error.config.slowRequestTimer);
        }
        // If all retries fail, we might want to keep the error or show a global error
        // For now, just reject so the component can handle it
        return Promise.reject(error);
    }
);

export default api;
