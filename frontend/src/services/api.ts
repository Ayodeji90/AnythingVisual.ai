import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const projectApi = {
    createProject: (data: { title: string; content_type: string; language: string }) =>
        api.post('/projects', data),

    getProjects: () => api.get('/projects'),

    analyzeScript: (projectId: number, text: string) =>
        api.post(`/projects/${projectId}/analyze?text=${encodeURIComponent(text)}`),
};

export default api;
