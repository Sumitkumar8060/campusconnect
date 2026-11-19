import api from "./axios";

// Register user
export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

// Login user
export const loginUser = async (userData) => {
    const response = await api.post("/auth/login", userData);
    return response.data;
};

// Google login
export const googleLoginUser = async (idToken) => {
    const response = await api.post("/auth/google", {
        idToken
    });
    return response.data;
};

// Get logged-in user
export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

// Logout user
export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};
