import type { SummaryResponse } from "../types/study";
import { apiRequest } from "./client";

export default function getSummary(topicId: string, projectId: string): Promise<SummaryResponse> {
    const params = new URLSearchParams({
        topic_id: topicId,
        project_id: projectId
    })

    return apiRequest<SummaryResponse>(`/api/study/summary?${params.toString()}`, {
        method: 'POST'
    })
}