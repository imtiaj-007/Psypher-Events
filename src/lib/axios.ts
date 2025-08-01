import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError
} from "axios";

const baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const internalConfig: InternalAxiosRequestConfig = {
            ...config,
            headers: config.headers || {},
        };
        if (internalConfig.data instanceof FormData) {
            internalConfig.headers['Content-Type'] = 'multipart/form-data';
        }
        return internalConfig;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    async (error: unknown) => {
        // Check if the error is an AxiosError
        if (!axios.isAxiosError(error) || !error.config) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

// Axios request handlers
const axiosHandler = {
    request: (config: AxiosRequestConfig) => axiosInstance.request(config),
    get: (url: string, config?: AxiosRequestConfig) => axiosInstance.get(url, config),
    post: (url: string, data?: unknown, config?: AxiosRequestConfig) => axiosInstance.post(url, data, config),
    put: (url: string, data?: unknown, config?: AxiosRequestConfig) => axiosInstance.put(url, data, config),
    patch: (url: string, data?: unknown, config?: AxiosRequestConfig) => axiosInstance.patch(url, data, config),
    delete: (url: string, config?: AxiosRequestConfig) => axiosInstance.delete(url, config),

    // Helper function for FormData requests
    postFormData: (url: string, formData: FormData, config: AxiosRequestConfig = {}) => {
        return axiosInstance.post(url, formData, {
            ...config,
            headers: {
                ...config.headers,
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default axiosHandler;