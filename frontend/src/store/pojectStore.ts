import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Topic } from "../types/topic"
import type { ProjectResponse } from "../types/project"

type ProjectStore = {
    projects: ProjectResponse[],
    currentProject: ProjectResponse,
    currentProjectTopics: Topic[],
    setProjects: (projects: ProjectResponse[]) => void,
    setCurrentProject: (currentProject: ProjectResponse) => void,
}

export const useProjectStore = create<ProjectStore>()(persist((set) => ({
    projects: [],
    currentProject: {
        id: '',
        name: '',
        created_at: ''
    },
    currentProjectTopics: [],

    setProjects(projects) {
        set({ projects });
    },

    setCurrentProject(currentProject) {
        set({ currentProject });
    },

}), {
    name: 'project-storage',
    partialize: (state) => ({
        projectTopics: state.currentProjectTopics
    })
}))