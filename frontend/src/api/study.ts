import type { FlashcardsResponse, QuizResponse, SummaryResponse } from "../types/study";
import { apiRequest } from "./client";

export function getSummary(topicId: string, projectId: string): Promise<SummaryResponse> {
    const params = new URLSearchParams({
        topic_id: topicId,
        project_id: projectId
    })

    return apiRequest<SummaryResponse>(`/api/study/summary?${params.toString()}`, {
        method: 'POST'
    })
}

export function getFlashcards(topicId: string, projectId: string): Promise<FlashcardsResponse> {
    const params = new URLSearchParams({
        topic_id: topicId,
        project_id: projectId
    })

    return apiRequest<FlashcardsResponse>(`/api/study/flashcards?${params.toString()}`, {
        method: "POST"
    })
}

export function getQuiz(topicId: string, projectId: string): Promise<QuizResponse> {
    const params = new URLSearchParams({
        topic_id: topicId,
        project_id  : projectId
    });

    return apiRequest<QuizResponse>(`/api/study/quiz?${params.toString()}`, {
        method: 'POST'
    });
}