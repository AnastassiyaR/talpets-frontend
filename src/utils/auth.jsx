import axios from 'axios';

// AXIOS INSTANCE CONFIGURATION
const axiosInstance = axios.create({
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("user-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const adminSecret = localStorage.getItem("ADMIN_SECRET");
        if (adminSecret) {
            config.headers["X-Admin-Secret"] = adminSecret;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            clearAuthData()
            alert('Your session has expired. Please log in again.');
            globalThis.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// AUTH HELPER FUNCTIONS
export const saveAuthData = (data) => {
    localStorage.setItem("user-token", data.token);
    localStorage.setItem("user-id", data.userId);
    localStorage.setItem("user-email", data.email);

    localStorage.setItem("user-firstname", data.firstName || "");
    localStorage.setItem("user-lastname", data.lastName || "");
    localStorage.setItem("user-photo", data.photo || "");
};

export const clearAuthData = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-id");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-firstname");
    localStorage.removeItem("user-lastname");
    localStorage.removeItem("user-photo");
    localStorage.removeItem("ADMIN_SECRET");
};

export const getUserId = () => {
    return localStorage.getItem("user-id");
};

export const getCurrentUserId = () => {
    const userId = localStorage.getItem("user-id");
    return userId ? parseInt(userId) : null;
};

export const getCurrentFirstName = () => {
    const firstName = localStorage.getItem("user-firstname");
    const lastName = localStorage.getItem("user-lastname");

    let result = "";

    if (firstName) {
        result += firstName;
    }

    if (lastName) {
        result += (result ? " " : "") + lastName;
    }

    return result || null;
};

export default axiosInstance;
