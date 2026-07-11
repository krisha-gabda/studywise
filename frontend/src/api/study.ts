import type { FlashcardsResponse, SummaryResponse } from "../types/study";
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
    return apiRequest<FlashcardsResponse>('/api/study/flashcards', {
        method: "POST",
        body: {
            topic_id: topicId,
            project_id: projectId
        }
    })
}