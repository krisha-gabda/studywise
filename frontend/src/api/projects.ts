import type { ProjectCreate, ProjectResponse } from "../types/project";
import { apiRequest } from "./client";

export function getProjects(): Promise<ProjectResponse[]> {
    return apiRequest<ProjectResponse[]>('/api/projects/projects', {
        method: 'GET'
    })
}

export function createProject(credentials: ProjectCreate): Promise<ProjectResponse> {
    return apiRequest<ProjectResponse>('/api/projects/projects', {
        method: 'POST',
        body: credentials
    })
}

export function deleteProject(id: string): Promise<void> {
    return apiRequest<void>(`/api/projects/projects/${id}`, {
        method: "DELETE"
    })
}