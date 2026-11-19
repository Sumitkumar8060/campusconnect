import api from "./axios";

export const getMyProfile = async () => {
    const response = await api.get('/profile/me');
    return response.data; // { success, message, profile, activities, listings, reviews }
};

export const updateMyProfile = async (profileData) => {
    const response = await api.put('/profile/me', profileData);
    return response.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
    const response = await api.put('/profile/me/password', {
        currentPassword,
        newPassword,
    });
    return response.data;
};

export const updateSettings = async (settingsData) => {
    const response = await api.put('/profile/me/settings', settingsData);
    return response.data;
};

export const deleteMyAccount = async (password) => {
    const response = await api.delete('/profile/me', {
        data: { password }
    });
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};

export const getPublicProfile = async (userId) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
};

export const uploadProfilePicture = async (imageFile) => {
    const formData = new FormData();
    formData.append('photo', imageFile);

    const response = await api.post('/profile/me/photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
