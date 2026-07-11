import { create } from "zustand"
import type { FlashcardsResponse } from "../types/study"
import { persist } from "zustand/middleware"

type StudyStore = {
    flashcards: FlashcardsResponse,
    setFlashcards: (flashcards: FlashcardsResponse)  => void,
}

export const useStudyStore = create<StudyStore>()(persist((set) => ({
    flashcards: {
        topic_id: '',
        topic_name: '',
        flashcards: []
    },

    setFlashcards(flashcards: FlashcardsResponse) {
        set({ flashcards });
    },
}), {
    name: 'study-storage',
    partialize: (state) => ({
        flashcards: state.flashcards
    })
}))