export interface Flashcard {
    question: string
    answer: string
}

export interface FlashcardsResponse {
    topic_id: string
    topic_name: string
    flashcards: Flashcard[]
}

export interface QuizQuestion {
    question: string
    options: string[]
    correct_index: number
}

export interface QuizResponse {
    topic_id: string
    topic_name: string
    questions: QuizQuestion[]
}

export interface QuizSubmission {
    topic_id: string
    answers: number[]
}

export interface SummaryResponse {
    headline: string
    summary: string
}