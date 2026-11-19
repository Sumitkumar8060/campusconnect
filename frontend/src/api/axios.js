
// import axios from "axios";

// const API = axios.create({
//     baseURL: "http://localhost:5000/api",
//     withCredentials: true,
//     headers: {
//         "Content-Type": "application/json"
//     }
// });

// export default API;

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;