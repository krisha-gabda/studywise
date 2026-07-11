import { create } from "zustand"
import type { Topic } from "../types/topic"
import { persist } from "zustand/middleware"
import type { SummaryResponse } from "../types/study"

type TopicsStore = {
    topics: Topic[],
    currentTopic: Topic,
    summary: SummaryResponse,
    setTopics: (topics: Topic[]) => void,
    setCurrentTopic: (currentTopic: Topic) => void,
    setSummary: (summary: SummaryResponse) => void
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
    summary: {
        headline: '',
        summary: ''
    },

    setTopics(topics: Topic[]) {
        set({ topics })
    },

    setCurrentTopic(currentTopic: Topic) {
        set({ currentTopic })
    },

    setSummary(summary) {
        set({ summary })
    },

}), {
    name: 'topic-storage',
    partialize: (state) => ({
        topics: state.topics
    })
}))