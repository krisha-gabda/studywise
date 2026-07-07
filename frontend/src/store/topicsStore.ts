import { create } from "zustand"
import type { Topic } from "../types/topic"
import { persist } from "zustand/middleware"

type TopicsStore = {
    topics: Topic[],
    currentTopic: Topic,
    setTopics: (topics: Topic[]) => void
}

export const useTopicsStore = create<TopicsStore>()(persist((set) => ({
    topics: [],
    currentTopic: {
        id: '',
        project_id: '',
        name: '',
        priority_score: 0.0,
        status: '',
        last_reviewed_at: '',
        created_at: ''
    },

    setTopics(topics: Topic[]) {
        set({ topics })
    }
}), {
    name: 'topic-storage',
    partialize: (state) => ({
        topics: state.topics
    })
}))