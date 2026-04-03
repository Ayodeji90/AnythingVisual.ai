import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'av_access_token';
const USER_KEY = 'av_user_profile';

// --- Token helpers ---
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getSavedUser(): any | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

export function saveUser(profile: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

// --- Axios instance ---
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Attach Authorization header to every request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401, clear auth state
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAuth();
            window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
    }
);

// --- API methods ---
export const projectApi = {
    createProject: (data: { title: string; content_type: string; language: string }) =>
        api.post('/projects', data),

    getProjects: () => api.get('/projects'),

    analyzeScript: (projectId: number, text: string) =>
        api.post(`/ai-pipeline/projects/${projectId}/analyze`, { text }),

    generateVariants: (projectId: number, text: string) =>
        api.post(`/ai-pipeline/projects/${projectId}/generate-variants`, { text }),

    selectVariant: (projectId: number, story: string) =>
        api.post(`/ai-pipeline/projects/${projectId}/select-variant`, { story }),

    getProject: (projectId: number) =>
        api.get(`/ai-pipeline/projects/${projectId}`),

    getBlueprint: (projectId: number) =>
        api.get(`/ai-pipeline/projects/${projectId}/blueprint`),

    // Script Generation (Idea → Full Script)
    generateScript: (projectId: number, idea: string, format: string = 'short', targetPages?: number) =>
        api.post(`/ai-pipeline/projects/${projectId}/generate-script`, {
            idea,
            format,
            target_pages: targetPages,
        }),

    getGeneratedScript: (projectId: number) =>
        api.get(`/ai-pipeline/projects/${projectId}/generated-script`),
};

export const authApi = {
    register: (data: any) => api.post('/auth/register', data),
    login: (email: string, pass: string) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', pass);
        return api.post('/auth/login/access-token', formData);
    },
    getMe: () => api.get('/auth/me'),
};

export function getApiBaseUrl(): string {
    return API_BASE_URL;
}

export default api;
