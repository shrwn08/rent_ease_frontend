import axios from "axios";


const API = axios.create({
    baseURL : import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    timeout : 10000,
});



API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");


    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

API.interceptors.response.use(
    res => res,
    error => {
        if(error.response?.status === 401){
            localStorage.removeItem("token");
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)



//Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post("/auth/login", data);