import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',  
    withCredentials: true, // Include cookies in requests
});

// 🔥 Add this interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Check if Clerk is loaded on the window and a session is active
        if (window.Clerk && window.Clerk.session) {
            try {
                // Fetch the active session token
                const token = await window.Clerk.session.getToken();
                
                if (token) {
                    // Attach it to the Authorization header
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Failed to fetch Clerk token:", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;