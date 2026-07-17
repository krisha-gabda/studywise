import { create } from "zustand"
import type { FlashcardsResponse, QuizResponse } from "../types/study"
import { persist } from "zustand/middleware"

type StudyStore = {
    flashcards: FlashcardsResponse,
    setFlashcards: (flashcards: FlashcardsResponse)  => void,
    quiz: QuizResponse,
    setQuiz: (quiz: QuizResponse) => void,
}

export const useStudyStore = create<StudyStore>()(persist((set) => ({
    flashcards: {
        topic_id: '',
        topic_name: '',
        flashcards: []
    },

    quiz: {
        questions: [],
        topic_id: '',
        topic_name: '',
    },

    setFlashcards(flashcards: FlashcardsResponse) {
        set({ flashcards });
    },

    setQuiz(quiz: QuizResponse) {
        set({ quiz })
    },
}), {
    name: 'study-storage',
    partialize: (state) => ({
        flashcards: state.flashcards,
        quiz: state.quiz,
    })
}))